import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        NavigationView {
            if authManager.isAuthenticated {
                WidgetSetupView()
            } else {
                AuthView()
            }
        }
    }
}

struct AuthView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var userId = ""
    @State private var showingHelp = false
    
    var body: some View {
        VStack(spacing: 24) {
            VStack(spacing: 16) {
                Image(systemName: "book.fill")
                    .font(.system(size: 60))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing)
                        )
                    )
                
                Text("BookShelfie")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text("Enter your User ID to sync your reading progress")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            
            VStack(spacing: 16) {
                VStack(spacing: 8) {
                    Text("User ID")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    TextField("Enter your User ID", text: $userId)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(.ultraThinMaterial)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.2), lineWidth: 1)
                                )
                        )
                        .cornerRadius(12)
                }
                
                Button(action: {
                    authManager.signIn(userId: userId)
                }) {
                    HStack {
                        Image(systemName: "key.fill")
                            Text("Sign In")
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "FF6B6B"), Color(hex: "FF8787")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing)
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .shadow(color: Color(hex: "FF6B6B").opacity(0.3), radius: 8, x: 0, y: 4)
                }
                .disabled(userId.isEmpty)
                .padding(.horizontal)
            }
            
            Spacer()
            
            VStack(spacing: 12) {
                Button(action: {
                    showingHelp = true
                }) {
                    HStack {
                        Image(systemName: "questionmark.circle")
                            Text("How to find your User ID")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
                .buttonStyle(PlainButtonStyle())
                
                if showingHelp {
                    VStack(spacing: 8) {
                        Text("1. Open BookShelfie web app")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text("2. Go to Settings/Profile")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text("3. Copy your User ID")
                            .font(.caption)
                    }
                    .padding()
                }
            }
            .padding(.bottom)
        }
        }
        .background(
            LinearGradient(
                colors: [
                    Color(hex: "FFF9F5"),
                    Color(hex: "FFF5F0")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing)
            )
        }
        .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
        .environmentObject(AuthManager())
    .preferredColorScheme(.light)
}