package com.hamahang.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.hamahang.app.ui.navigation.Screen
import com.hamahang.app.ui.screens.auth.LoginScreen
import com.hamahang.app.ui.screens.auth.OtpVerifyScreen
import com.hamahang.app.ui.screens.explore.ExploreScreen
import com.hamahang.app.ui.screens.home.HomeScreen
import com.hamahang.app.ui.screens.onboarding.GenreSelectionScreen
import com.hamahang.app.ui.screens.onboarding.MoodSelectionScreen
import com.hamahang.app.ui.screens.onboarding.ProfileSetupScreen
import com.hamahang.app.ui.screens.profile.ProfileScreen
import com.hamahang.app.ui.screens.room.RoomDetailScreen
import com.hamahang.app.ui.screens.search.SearchScreen
import com.hamahang.app.ui.screens.splash.SplashScreen
import com.hamahang.app.ui.theme.HamahangTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HamahangTheme {
                HamahangNavGraph()
            }
        }
    }
}

@Composable
fun HamahangNavGraph() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Screen.Splash.route) {

        // Splash
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateToHome = { navController.navigate(Screen.Home.route) { popUpTo(0) } },
                onNavigateToOnboarding = { navController.navigate(Screen.GenreSelection.route) { popUpTo(0) } },
            )
        }

        // Onboarding
        composable(Screen.GenreSelection.route) {
            GenreSelectionScreen(
                onNext = { navController.navigate(Screen.MoodSelection.route) }
            )
        }

        composable(Screen.MoodSelection.route) {
            MoodSelectionScreen(
                onNext = { navController.navigate(Screen.ProfileSetup.route) },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ProfileSetup.route) {
            ProfileSetupScreen(
                onComplete = { navController.navigate(Screen.OtpLogin.route) },
                onBack = { navController.popBackStack() }
            )
        }

        // Auth
        composable(Screen.OtpLogin.route) {
            LoginScreen(
                onVerify = { phone -> navController.navigate(Screen.OtpVerify.createRoute(phone)) }
            )
        }

        composable(
            route = Screen.OtpVerify.route,
            arguments = listOf(navArgument("phone") { type = NavType.StringType })
        ) { backStackEntry ->
            val phone = backStackEntry.arguments?.getString("phone") ?: ""
            OtpVerifyScreen(
                phone = phone,
                onVerified = { navController.navigate(Screen.Home.route) { popUpTo(0) } },
                onBack = { navController.popBackStack() }
            )
        }

        // Main
        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToRoom = { roomId -> navController.navigate(Screen.RoomDetail.createRoute(roomId)) },
                onNavigateToProfile = { navController.navigate(Screen.Profile.route) },
                onNavigateToSearch = { navController.navigate(Screen.Search.route) },
            )
        }

        composable(Screen.Explore.route) {
            ExploreScreen(
                onNavigateToRoom = { roomId -> navController.navigate(Screen.RoomDetail.createRoute(roomId)) }
            )
        }

        composable(Screen.Search.route) {
            SearchScreen(
                onNavigateToRoom = { roomId -> navController.navigate(Screen.RoomDetail.createRoute(roomId)) },
                onBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.RoomDetail.route,
            arguments = listOf(navArgument("roomId") { type = NavType.StringType })
        ) { backStackEntry ->
            val roomId = backStackEntry.arguments?.getString("roomId") ?: ""
            RoomDetailScreen(
                roomId = roomId,
                onBack = { navController.popBackStack() },
                onNavigateToProfile = { userId -> navController.navigate(Screen.OtherProfile.createRoute(userId)) }
            )
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                onNavigateToPremium = { navController.navigate(Screen.Premium.route) },
                onNavigateToStickers = { navController.navigate(Screen.StickerWallet.route) },
                onNavigateToLikes = { navController.navigate(Screen.Likes.route) },
                onNavigateToMatches = { navController.navigate(Screen.Matches.route) },
                onNavigateToCreateRoom = { navController.navigate(Screen.CreateRoom.route) },
            )
        }
    }
}
