package com.hamahang.app.data.api

import com.hamahang.app.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

// ---------- DTOs ----------
data class OtpResponse(val message: String, val expiresIn: Int)
data class AuthResponse(val accessToken: String, val refreshToken: String, val user: UserDto)
data class TokenRefreshRequest(val refreshToken: String)
data class TokenRefreshResponse(val accessToken: String, val refreshToken: String)

data class UserDto(
    val id: String? = null,
    val phone: String? = null,
    val name: String? = null,
    val gender: String? = null,
    val city: String? = null,
    val birthYear: Int? = null,
    val avatarUrl: String? = null,
    val bio: String? = null,
    val isSample: Boolean? = null,
    val isPremium: Boolean? = null,
    val premiumExpiresAt: String? = null,
    val onboardingCompleted: Boolean? = null,
    val accountStatus: String? = null,
    val createdAt: String? = null,
)

data class CategoryDto(val id: String, val nameFa: String, val type: String, val icon: String?, val isActive: Boolean?)
data class SongDto(val id: String, val title: String, val artistName: String, val audioUrl: String, val coverUrl: String?, val durationSeconds: Int)
data class RoomDto(val id: String, val title: String, val categoryId: String?, val ownerUserId: String?, val isLive: Boolean?, val isPublic: Boolean?, val listenerCount: Int?, val currentSongId: String?, val coverUrl: String?)
data class RoomMessageDto(val id: String, val roomId: String, val userId: String, val text: String, val createdAt: String)
data class LikeDto(val id: String, val fromUserId: String, val toUserId: String, val createdAt: String)
data class MatchDto(val id: String, val userAId: String, val userBId: String, val createdAt: String)
data class ConversationDto(val id: String, val userAId: String, val userBId: String, val matchId: String?)
data class MessageDto(val id: String, val conversationId: String, val senderId: String, val text: String, val createdAt: String)
data class StickerTypeDto(val id: String, val name: String, val imageUrl: String, val isActive: Boolean?, val defaultStarterQuantity: Int?)
data class StickerWalletDto(val userId: String, val stickerTypeId: String, val balance: Int, val stickerType: StickerTypeDto?)
data class SubscriptionDto(val id: String, val userId: String, val sku: String, val status: String, val expiresAt: String)
data class RoomPlanDto(val id: String, val name: String, val maxCapacity: Int, val price: Int, val sku: String?)
data class BlockDto(val id: String, val blockerUserId: String, val blockedUserId: String)
data class ReportDto(val reason: String, val description: String?, val reportedUserId: String)
data class SampleCharacterDto(val id: String, val name: String, val gender: String, val city: String?, val bio: String?, val avatarUrl: String?)
data class PresetMessageDto(val id: String?, val text: String, val sortOrder: Int?)
data class ProfileStoryDto(val id: String, val userId: String, val audioUrl: String, val durationSeconds: Int, val expiresAt: String)
data class FeatureFlagDto(val key: String, val isEnabled: Boolean, val description: String?)
data class DashboardStats(val totalUsers: Int, val activeUsers: Int, val premiumUsers: Int, val totalRooms: Int, val liveRooms: Int, val totalSongs: Int, val activeSubscriptions: Int, val premiumRate: String)

// ---------- API Interface ----------
interface HamahangApi {

    // Auth
    @POST("auth/send-otp")
    suspend fun sendOtp(@Body body: Map<String, String>): Response<OtpResponse>

    @POST("auth/verify-otp")
    suspend fun verifyOtp(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<AuthResponse>

    @POST("auth/refresh")
    suspend fun refreshToken(@Body body: TokenRefreshRequest): Response<TokenRefreshResponse>

    @GET("auth/profile")
    suspend fun getProfile(): Response<UserDto>

    // Users
    @GET("users/profile")
    suspend fun getUserProfile(): Response<UserDto>

    @PUT("users/profile")
    suspend fun updateProfile(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<UserDto>

    @PUT("users/onboarding")
    suspend fun completeOnboarding(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<UserDto>

    @GET("users/search")
    suspend fun searchUsers(@Query("q") query: String): Response<List<UserDto>>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: String): Response<UserDto>

    // Categories
    @GET("categories")
    suspend fun getCategories(@Query("type") type: String? = null): Response<List<CategoryDto>>

    @POST("users/categories/preferences")
    suspend fun setCategoryPreferences(@Body body: Map<String, List<String>>): Response<Any>

    // Songs
    @GET("songs")
    suspend fun getSongs(@Query("categoryId") categoryId: String? = null, @Query("search") search: String? = null): Response<List<SongDto>>

    @POST("songs/{id}/play")
    suspend fun incrementPlayCount(@Path("id") id: String): Response<Any>

    // Rooms
    @GET("rooms")
    suspend fun getRooms(@Query("categoryId") categoryId: String? = null): Response<List<RoomDto>>

    @GET("rooms/{id}")
    suspend fun getRoomById(@Path("id") id: String): Response<RoomDto>

    @POST("rooms")
    suspend fun createRoom(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<RoomDto>

    @POST("rooms/{id}/join")
    suspend fun joinRoom(@Path("id") id: String): Response<Any>

    @POST("rooms/{id}/leave")
    suspend fun leaveRoom(@Path("id") id: String): Response<Any>

    @GET("rooms/{id}/messages")
    suspend fun getRoomMessages(@Path("id") id: String): Response<List<RoomMessageDto>>

    // Likes
    @POST("likes/{userId}")
    suspend fun likeUser(@Path("userId") userId: String): Response<LikeDto>

    @DELETE("likes/{userId}")
    suspend fun unlikeUser(@Path("userId") userId: String): Response<Any>

    @GET("likes/received")
    suspend fun getReceivedLikes(): Response<List<LikeDto>>

    @GET("likes/sent")
    suspend fun getSentLikes(): Response<List<LikeDto>>

    // Matches
    @GET("matches")
    suspend fun getMatches(): Response<List<MatchDto>>

    // Conversations
    @GET("conversations")
    suspend fun getConversations(): Response<List<ConversationDto>>

    @POST("conversations")
    suspend fun createConversation(@Body body: Map<String, String>): Response<ConversationDto>

    @GET("conversations/{id}/messages")
    suspend fun getConversationMessages(@Path("id") id: String): Response<List<MessageDto>>

    @POST("messages")
    suspend fun sendMessage(@Body body: Map<String, String>): Response<MessageDto>

    // Stickers
    @GET("stickers/types")
    suspend fun getStickerTypes(): Response<List<StickerTypeDto>>

    @GET("stickers/wallet")
    suspend fun getStickerWallet(): Response<List<StickerWalletDto>>

    @POST("stickers/gift")
    suspend fun giftSticker(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<Any>

    @POST("stickers/purchase")
    suspend fun purchaseStickerPack(@Body body: Map<String, String>): Response<Any>

    // VIP / Subscription
    @POST("vip/subscribe")
    suspend fun subscribeVip(@Body body: Map<String, String>): Response<SubscriptionDto>

    @GET("vip/status")
    suspend fun getVipStatus(): Response<SubscriptionDto>

    // Blocks
    @POST("blocks/{userId}")
    suspend fun blockUser(@Path("userId") userId: String): Response<BlockDto>

    @DELETE("blocks/{userId}")
    suspend fun unblockUser(@Path("userId") userId: String): Response<Any>

    @GET("blocks")
    suspend fun getBlockedUsers(): Response<List<BlockDto>>

    // Reports
    @POST("reports")
    suspend fun reportUser(@Body body: ReportDto): Response<Any>

    // Sample Characters
    @GET("sample-characters")
    suspend fun getSampleCharacters(): Response<List<SampleCharacterDto>>

    // Preset Messages
    @GET("preset-messages")
    suspend fun getPresetMessages(): Response<List<PresetMessageDto>>

    @POST("preset-messages")
    suspend fun createPresetMessage(@Body body: PresetMessageDto): Response<PresetMessageDto>

    @DELETE("preset-messages/{id}")
    suspend fun deletePresetMessage(@Path("id") id: String): Response<Any>

    @POST("preset-messages/{id}/send/{roomId}/{targetUserId}")
    suspend fun sendPresetMessage(@Path("id") id: String, @Path("roomId") roomId: String, @Path("targetUserId") targetUserId: String): Response<Any>

    // Stories
    @POST("stories")
    suspend fun createStory(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<ProfileStoryDto>

    @GET("stories/{userId}")
    suspend fun getUserStory(@Path("userId") userId: String): Response<ProfileStoryDto>

    // Room Orders
    @GET("room-orders/plans")
    suspend fun getRoomPlans(): Response<List<RoomPlanDto>>

    @POST("room-orders/orders")
    suspend fun createRoomOrder(@Body body: Map<String, String>): Response<Any>

    // Sponsored rooms
    @POST("sponsored-rooms/requests")
    suspend fun createSponsoredRoomRequest(@Body body: Map<String, @JvmSuppressWildcards Any>): Response<Any>

    // Dashboard (admin)
    @GET("dashboard/stats")
    suspend fun getDashboardStats(): Response<DashboardStats>

    // Feature flags
    @GET("feature-flags")
    suspend fun getFeatureFlags(): Response<List<FeatureFlagDto>>
}

// ---------- Retrofit Client ----------
object ApiClient {
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .build()
            chain.proceed(request)
        }
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val api: HamahangApi = retrofit.create(HamahangApi::class.java)

    fun authenticatedClient(token: String): OkHttpClient {
        return okHttpClient.newBuilder()
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .build()
                chain.proceed(request)
            }
            .build()
    }
}
