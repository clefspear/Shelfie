import WidgetKit
import SwiftUI

struct WidgetData: Codable {
    let user: UserData?
    let currently_reading: [BookData]
    let friends_reading: [FriendReading]
}

struct UserData: Codable {
    let display_name: String?
    let avatar_config: AvatarConfig?
}

struct AvatarConfig: Codable {
    let emoji: String?
    let color: String?
}

struct BookData: Codable {
    let title: String
    let author: String
    let cover_url: String?
    let current_page: Int
    let total_pages: Int
    let progress_percent: Int
}

struct FriendReading: Codable {
    let friend_name: String?
    let friend_avatar: AvatarConfig?
    let title: String
    let cover_url: String?
    let current_page: Int
    let total_pages: Int
    let progress_percent: Int
}

struct WidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), data: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), data: nil)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        Task {
            let data = await fetchWidgetData()
            let entry = SimpleEntry(date: Date(), data: data)
            let _ = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
    }
    
    private func fetchWidgetData() async -> WidgetData? {
        guard let userId = UserDefaults(suiteName: "group.com.bookshelfie.shelfie")?.string(forKey: "user_id"),
              let url = URL(string: "https://bookshelfie.vercel.app/api/widget-data?user_id=\(userId)") else {
            return nil
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            return try JSONDecoder().decode(WidgetData.self, from: data)
        } catch {
            return nil
        }
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let data: WidgetData?
}

struct ShelfieWidgetEntryView: View {
    var entry: WidgetProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack(spacing: 0) {
            if let data = entry.data {
                switch family {
                case .systemSmall:
                    SmallWidgetView(book: data.currently_reading.first)
                case .systemMedium:
                    MediumWidgetView(books: Array(data.currently_reading.prefix(3)))
                case .systemLarge:
                    LargeWidgetView(data: data)
                default:
                    VStack(spacing: 12) {
                        Image(systemName: "book")
                            .font(.system(size: 32))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")],
                            startPoint: .topLeading, endPoint: .bottomTrailing)
                        )
                        
                        Text("Unsupported widget size")
                            .font(.caption).fontWeight(.medium).foregroundColor(.primary)
                    }
                    .padding(16)
                    .glassBackground()
                }
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "book")
                        .font(.system(size: family == .systemSmall ? 24 : 32, weight: .medium))
                        .foregroundStyle(
                            LinearGradient(
                                    colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing)
                            )
                    
                    Text("Sign in to see your books")
                        .font(.caption).fontWeight(.medium).foregroundColor(.primary)
                    
                    if family != .systemSmall {
                        Text("Add books in app to see them here")
                            .font(.caption2).foregroundColor(.secondary).multilineTextAlignment(.center)
                    }
                }
                .padding(16)
                .glassBackground()
            }
        }
        .containerBackground(.clear, for: .widget)
    }
}

// MARK: - Small Widget View
struct SmallWidgetView: View {
    let book: BookData?
    
    var body: some View {
        if let book = book {
            VStack(alignment: .leading, spacing: 12) {
                AsyncImage(url: URL(string: book.cover_url ?? "")) { image in
                    image.resizable().aspectRatio(contentMode: .fit)
                } placeholder: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(.ultraThinMaterial)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8).stroke(Color.white.opacity(0.2), lineWidth: 1)
                            .overlay(
                                Image(systemName: "book.fill").font(.title2).foregroundStyle(LinearGradient(colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")], startPoint: .topLeading, endPoint: .bottomTrailing))
                            )
                        )
                        .shadow(color: .black.opacity(0.2), radius: 6, x: 0, y: 3)
                }
                .frame(height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .shadow(color: .black.opacity(0.2), radius: 6, x: 0, y: 3)
                
                Text(book.title)
                    .font(.caption).fontWeight(.semibold).lineLimit(2).foregroundColor(.primary)
                
                VStack(spacing: 6) {
                    HStack(spacing: 8) {
                        ProgressBar(progress: book.progress_percent)
                        Text("\(book.progress_percent)%")
                            .font(.caption2).fontWeight(.medium).foregroundColor(Color(hex: "FF6B6B"))
                    }
                    
                    Text("\(book.current_page) / \(book.total_pages) pages")
                        .font(.caption2).foregroundColor(.secondary)
                }
            }
            .padding(16)
            .glassBackground()
        } else {
            VStack(spacing: 12) {
                Image(systemName: "book")
                    .font(.system(size: 24))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")],
                            startPoint: .topLeading, endPoint: .bottomTrailing)
                        )
                
                Text("Sign in to see your books")
                    .font(.caption).fontWeight(.medium).foregroundColor(.primary)
                    
                Text("Add books in app to see them here")
                    .font(.caption2).foregroundColor(.secondary).multilineTextAlignment(.center)
            }
            .padding(16)
            .glassBackground()
        }
    }
}

// MARK: - Progress Bar
struct ProgressBar: View {
    let progress: Int
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 2)
                    .fill(.ultraThinMaterial)
                    .frame(height: 4)
                    .overlay(RoundedRectangle(cornerRadius: 2).stroke(Color.white.opacity(0.2), lineWidth: 0.5))
                
                RoundedRectangle(cornerRadius: 2)
                    .fill(LinearGradient(colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")], startPoint: .leading, endPoint: .trailing))
                    .frame(width: geometry.size.width * CGFloat(progress) / 100, height: 4)
                    .shadow(color: Color(hex: "FF6B6B").opacity(0.4), radius: 3, x: 0, y: 1)
                    .overlay(RoundedRectangle(cornerRadius: 2).fill(LinearGradient(colors: [Color.white.opacity(0.3), Color.clear], startPoint: .top, endPoint: .bottom)))
            }
        }
        .frame(height: 4)
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Medium Widget View
struct MediumWidgetView: View {
    let books: [BookData]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Currently Reading")
                .font(.caption).fontWeight(.semibold).foregroundColor(.primary)
                .padding(.horizontal, 16)
                .padding(.top, 16)
            
            HStack(spacing: 12) {
                ForEach(Array(books.enumerated()), id: \.offset) { index, book in
                    VStack(spacing: 8) {
                        AsyncImage(url: URL(string: book.cover_url ?? "")) { image in
                            image.resizable().aspectRatio(contentMode: .fit)
                        } placeholder: {
                            RoundedRectangle(cornerRadius: 6)
                                .fill(.ultraThinMaterial)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 6).stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                                    .overlay(
                                        Image(systemName: "book.fill").font(.caption).foregroundStyle(LinearGradient(colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")], startPoint: .topLeading, endPoint: .bottomTrailing))
                                    )
                                )
                        }
                        .frame(height: 50)
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                        .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                        
                        Text(book.title)
                            .font(.caption2).fontWeight(.medium).lineLimit(2).multilineTextAlignment(.center).foregroundColor(.primary)
                        
                        VStack(spacing: 4) {
                            ProgressBar(progress: book.progress_percent)
                            Text("\(book.progress_percent)%")
                                .font(.caption2).fontWeight(.medium).foregroundColor(Color(hex: "FF6B6B"))
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
                
                if books.count < 3 {
                    ForEach(0..<(3 - books.count), id: \.self) { _ in
                        Spacer().frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .glassBackground()
    }
}

// MARK: - Large Widget View
struct LargeWidgetView: View {
    let data: WidgetData
    
    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 12) {
                Text("My Reading")
                    .font(.caption).fontWeight(.semibold).foregroundColor(.primary)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                    ForEach(Array(data.currently_reading.prefix(4).enumerated()), id: \.offset) { index, book in
                        VStack(spacing: 8) {
                            AsyncImage(url: URL(string: book.cover_url ?? "")) { image in
                                image.resizable().aspectRatio(contentMode: .fit)
                            } placeholder: {
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(.ultraThinMaterial)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6).stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                                    )
                                    .overlay(
                                        Image(systemName: "book.fill").font(.caption).foregroundStyle(LinearGradient(colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")], startPoint: .topLeading, endPoint: .bottomTrailing))
                                    )
                        }
                            .frame(height: 60)
                            .clipShape(RoundedRectangle(cornerRadius: 6))
                            .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                            
                            Text(book.title)
                                .font(.caption).fontWeight(.medium).lineLimit(2).foregroundColor(.primary)
                            
                            VStack(spacing: 4) {
                                ProgressBar(progress: book.progress_percent)
                                Text("\(book.progress_percent)%")
                                    .font(.caption2).fontWeight(.medium).foregroundColor(Color(hex: "FF6B6B"))
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
            
            HStack {
                Rectangle()
                    .fill(LinearGradient(colors: [Color.clear, Color.white.opacity(0.3), Color.clear], startPoint: .leading, endPoint: .trailing))
                    .frame(height: 1)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Friends Reading")
                    .font(.caption).fontWeight(.semibold).foregroundColor(.primary)
                    .padding(.horizontal, 16)
                
                VStack(spacing: 10) {
                    ForEach(Array(data.friends_reading.prefix(3).enumerated()), id: \.offset) { index, friend in
                        HStack(spacing: 12) {
                            Circle()
                                .fill(LinearGradient(colors: [Color(hex: friend.friend_avatar?.color ?? "FF6B6B"), Color(hex: "FF8787")], startPoint: .topLeading, endPoint: .bottomTrailing))
                                .frame(width: 32, height: 32)
                                .overlay(
                                    Text(friend.friend_avatar?.emoji ?? "📚").font(.system(size: friend.friend_avatar?.emoji != nil ? 19 : 16))
                                )
                                .shadow(color: Color(hex: "FF6B6B").opacity(0.3), radius: 2, x: 0, y: 1)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(friend.friend_name ?? "Friend")
                                    .font(.caption).fontWeight(.medium).foregroundColor(.primary)
                                
                                Text(friend.title)
                                    .font(.caption2).foregroundColor(.secondary).lineLimit(1)
                            }
                            
                            Spacer()
                            
                            VStack(spacing: 4) {
                                ProgressBar(progress: friend.progress_percent)
                                    .frame(width: 40)
                                Text("\(friend.progress_percent)%")
                                    .font(.caption2).fontWeight(.medium).foregroundColor(Color(hex: "FF6B6B"))
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                }
                .padding(.bottom, 16)
            }
        }
        .glassBackground()
    }
}

@main
struct ShelfieWidget: Widget {
    let kind: String = "ShelfieWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WidgetProvider()) { entry in
            ShelfieWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("BookShelfie")
        .description("See your reading progress and what friends are reading")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}