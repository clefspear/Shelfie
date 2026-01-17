import SwiftUI
import KeychainAccess

struct WidgetSetupView: View {
    @State private var userID: String = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    private let userDefaults = UserDefaults(suiteName: "group.com.bookshelfie.shelfie")
    private let keychain = Keychain(service: "com.bookshelfie.shelfie")
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Header
                VStack(spacing: 16) {
                    Image(systemName: "book.circle.fill")
                        .font(.system(size: 60))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.red.opacity(0.8), Color.pink.opacity(0.8)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                    
                    Text("BookShelfie")
                        .font(.largeTitle).fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    Text("Configure your widget to see your reading progress")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 20)
                
                // User ID Input
                VStack(alignment: .leading, spacing: 12) {
                    Text("User ID")
                        .font(.headline).fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    TextField("Enter your user ID", text: $userID)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                    
                    Text("This ID connects the widget to your Shelfie account")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Save Button
                Button(action: saveUserID) {
                    Text("Save Configuration")
                        .font(.headline).fontWeight(.semibold)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(
                                colors: [Color.red.opacity(0.8), Color.pink.opacity(0.8)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .padding(.horizontal)
                .padding(.bottom, 30)
            }
            .background(
                LinearGradient(
                    colors: [Color.white, Color.gray.opacity(0.1)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationBarHidden(true)
        }
        .onAppear(perform: loadUserID)
        .alert("Configuration", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    private func saveUserID() {
        guard !userID.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            alertMessage = "Please enter a valid user ID"
            showAlert = true
            return
        }
        
        // Save to both UserDefaults (for widget) and Keychain (for main app)
        userDefaults?.set(userID, forKey: "user_id")
        
        do {
            try keychain.set(userID, key: "user_id")
            alertMessage = "User ID saved successfully! The widget will update within 30 minutes."
        } catch {
            alertMessage = "Error saving user ID: \(error.localizedDescription)"
        }
        
        showAlert = true
    }
    
    private func loadUserID() {
        // Try to load from Keychain first, then UserDefaults
        if let savedID = try? keychain.get("user_id") {
            userID = savedID
        } else if let savedID = userDefaults?.string(forKey: "user_id") {
            userID = savedID
        }
    }
}

#Preview {
    WidgetSetupView()
}