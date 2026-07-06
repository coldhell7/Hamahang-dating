package com.hamahang.app.ui.screens.discover

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.data.api.SampleCharacterDto
import com.hamahang.app.ui.theme.AccentPurple
import com.hamahang.app.ui.theme.CardBorder
import com.hamahang.app.ui.theme.DarkBackground
import com.hamahang.app.ui.theme.DarkCard
import com.hamahang.app.ui.theme.SurfaceLight
import com.hamahang.app.ui.theme.TextMuted
import com.hamahang.app.ui.theme.TextPrimary
import com.hamahang.app.ui.theme.TextSecondary
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoverScreen(
    onBack: () -> Unit = {},
    onNavigateToProfile: (String) -> Unit = {},
) {
    var characters by remember { mutableStateOf<List<SampleCharacterDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var currentIndex by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        try {
            val response = ApiClient.api.getSampleCharacters()
            if (response.isSuccessful) {
                characters = response.body() ?: emptyList()
            } else {
                error = "خطا در دریافت اطلاعات"
            }
        } catch (e: Exception) {
            error = "خطا در اتصال به سرور"
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        containerColor = DarkBackground,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "کشف کاربران",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = TextPrimary,
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground),
            )
        },
    ) { padding ->
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(color = AccentPurple)
            }
        } else if (error != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = error ?: "",
                    color = MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.Center,
                )
            }
        } else if (characters.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center,
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = TextMuted,
                        modifier = Modifier.size(64.dp),
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "کاربری برای کشف وجود ندارد",
                        color = TextMuted,
                        fontSize = 16.sp,
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                items(characters) { character ->
                    DiscoverProfileCard(
                        character = character,
                        onLike = {
                            // Like action - in production with real user IDs
                            CoroutineScope(Dispatchers.IO).launch {
                                try {
                                    ApiClient.api.likeUser(character.id)
                                } catch (_: Exception) {}
                            }
                        },
                        onDislike = {
                            // Skip / pass
                        },
                        onProfileClick = { onNavigateToProfile(character.id) },
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

@Composable
private fun DiscoverProfileCard(
    character: SampleCharacterDto,
    onLike: () -> Unit,
    onDislike: () -> Unit,
    onProfileClick: () -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = DarkCard),
        border = CardDefaults.outlinedCardBorder().copy(
            width = 1.dp,
            brush = androidx.compose.ui.graphics.SolidColor(CardBorder),
        ),
    ) {
        Column {
            // Avatar section
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(AccentPurple.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center,
            ) {
                if (character.avatarUrl != null) {
                    AsyncImage(
                        model = character.avatarUrl,
                        contentDescription = character.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(AccentPurple.copy(alpha = 0.3f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            tint = AccentPurple,
                            modifier = Modifier.size(40.dp),
                        )
                    }
                }
            }

            // Info section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
            ) {
                Text(
                    text = character.name,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    val genderText = when (character.gender) {
                        "male" -> "مرد"
                        "female" -> "زن"
                        else -> character.gender
                    }
                    Text(
                        text = genderText,
                        fontSize = 14.sp,
                        color = TextSecondary,
                    )
                    if (character.city != null) {
                        Text(
                            text = " • ${character.city}",
                            fontSize = 14.sp,
                            color = TextSecondary,
                        )
                    }
                }

                if (character.bio != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = character.bio,
                        fontSize = 14.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Start,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                ) {
                    // Dislike
                    FilledIconButton(
                        onClick = onDislike,
                        modifier = Modifier.size(56.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(
                            containerColor = SurfaceLight,
                        ),
                        shape = CircleShape,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "عدم علاقه",
                            tint = TextSecondary,
                            modifier = Modifier.size(28.dp),
                        )
                    }

                    // Profile
                    FilledIconButton(
                        onClick = onProfileClick,
                        modifier = Modifier.size(56.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(
                            containerColor = AccentPurple.copy(alpha = 0.3f),
                        ),
                        shape = CircleShape,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "مشاهده پروفایل",
                            tint = AccentPurple,
                            modifier = Modifier.size(28.dp),
                        )
                    }

                    // Like
                    FilledIconButton(
                        onClick = onLike,
                        modifier = Modifier.size(56.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(
                            containerColor = Color(0xFFE74C3C).copy(alpha = 0.2f),
                        ),
                        shape = CircleShape,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = "علاقه",
                            tint = Color(0xFFE74C3C),
                            modifier = Modifier.size(28.dp),
                        )
                    }
                }
            }
        }
    }
}
