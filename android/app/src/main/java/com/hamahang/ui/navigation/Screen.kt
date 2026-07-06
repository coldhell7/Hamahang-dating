package com.hamahang.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Person
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String) {
    // Onboarding
    object Splash : Screen("splash", "هم‌آهنگ")
    object ExploreGuest : Screen("explore_guest", "کاوش")
    object GenreSelection : Screen("genre_selection", "انتخاب سبک")
    object MoodSelection : Screen("mood_selection", "انتخاب حس‌وحال")
    object ProfileSetup : Screen("profile_setup", "تکمیل پروفایل")
    object OtpLogin : Screen("otp_login", "ورود")
    object OtpVerify : Screen("otp_verify/{phone}", "تایید کد") {
        fun createRoute(phone: String) = "otp_verify/$phone"
    }

    // Main App
    object Home : Screen("home", "خانه")
    object Explore : Screen("explore", "کاوش")
    object Search : Screen("search", "جستجو")
    object RoomDetail : Screen("room/{roomId}", "روم") {
        fun createRoute(roomId: String) = "room/$roomId"
    }
    object Discover : Screen("discover", "کشف")
    object Likes : Screen("likes", "لایک‌ها")
    object Matches : Screen("matches", "مچ‌ها")
    object Chat : Screen("chat/{conversationId}", "چت") {
        fun createRoute(conversationId: String) = "chat/$conversationId"
    }
    object Profile : Screen("profile", "پروفایل من")
    object OtherProfile : Screen("profile/{userId}", "پروفایل") {
        fun createRoute(userId: String) = "profile/$userId"
    }
    object Premium : Screen("premium", "ارتقا به پرمیوم")
    object StickerWallet : Screen("sticker_wallet", "کیف استیکر")
    object CreateRoom : Screen("create_room", "ساخت روم")
    object SponsoredRoom : Screen("sponsored_room", "درخواست روم اسپانسری")
    object Settings : Screen("settings", "تنظیمات")
    object BlockedUsers : Screen("blocked_users", "کاربران بلاک شده")
    object PresetMessages : Screen("preset_messages", "پیام‌های سریع")
}

data class BottomNavItem(
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val route: String,
)

val bottomNavItems = listOf(
    BottomNavItem(
        label = "خانه",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home,
        route = Screen.Home.route,
    ),
    BottomNavItem(
        label = "کاوش",
        selectedIcon = Icons.Filled.Explore,
        unselectedIcon = Icons.Outlined.Explore,
        route = Screen.Explore.route,
    ),
    BottomNavItem(
        label = "کشف",
        selectedIcon = Icons.Filled.Favorite,
        unselectedIcon = Icons.Outlined.FavoriteBorder,
        route = Screen.Discover.route,
    ),
    BottomNavItem(
        label = "جستجو",
        selectedIcon = Icons.Filled.Search,
        unselectedIcon = Icons.Outlined.Search,
        route = Screen.Search.route,
    ),
    BottomNavItem(
        label = "پروفایل",
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person,
        route = Screen.Profile.route,
    ),
)
