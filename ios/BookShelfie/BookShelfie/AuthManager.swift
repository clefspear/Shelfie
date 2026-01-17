import Foundation
import SwiftUI
import KeychainAccess

class AuthManager: ObservableObject {
    private let keychain = Keychain(service: "com.bookshelfie.shelfie")
    private let userDefaults = UserDefaults(suiteName: "group.com.bookshelfie.shelfie")
    
    @Published var isAuthenticated = false
    
    init() {
        checkAuthentication()
    }
    
    func signIn(userId: String) {
        do {
            try keychain.set(userId, key: "user_id")
            
            userDefaults?.set(userId, forKey: "user_id")
            
            isAuthenticated = true
        } catch {
            print("Error storing user ID: \(error)")
        }
    }
    
    func signOut() {
        do {
            try keychain.remove("user_id")
            userDefaults?.removeObject(forKey: "user_id")
            isAuthenticated = false
        } catch {
            print("Error removing user ID: \(error)")
        }
    }
    
    private func checkAuthentication() {
        do {
            let userId = try keychain.get("user_id")
            isAuthenticated = (userId != nil)
        } catch {
            isAuthenticated = false
        }
    }
    
    func getUserId() -> String? {
        do {
            return try keychain.get("user_id")
        } catch {
            return nil
        }
    }
}