package com.hamahang.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.data.api.RoomDto
import com.hamahang.app.data.api.CategoryDto
import com.hamahang.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToRoom: (String) -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToSearch: () -> Unit,
) {
    var rooms by remember { mutableStateOf<List<RoomDto>>(emptyList()) }
    var categories by remember { mutableStateOf<List<CategoryDto>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val roomsRes = ApiClient.api.getRooms()
            if (roomsRes.isSuccessful) rooms = roomsRes.body() ?: emptyList()
            val catRes = ApiClient.api.getCategories(null)
            if (catRes.isSuccessful) categories = catRes.body() ?: emptyList()
        } catch (_: Exception) { } finally {
            loading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("هم‌آهنگ", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onNavigateToSearch) {
                        Icon(Icons.Default.Search, contentDescription = "جستجو", tint = TextPrimary)
                    }
                    IconButton(onClick = onNavigateToProfile) {
                        Icon(Icons.Default.Person, contentDescription = "پروفایل", tint = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground),
            )
        },
        bottomBar = {
            BottomAppBar(containerColor = DarkSurface) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    IconButton(onClick = { }) { Icon(Icons.Default.Home, "خانه", tint = AccentPurple) }
                    IconButton(onClick = { }) { Icon(Icons.Default.Explore, "کاوش", tint = TextSecondary) }
                    IconButton(onClick = { }) { Icon(Icons.Default.FavoriteBorder, "کشف", tint = TextSecondary) }
                    IconButton(onClick = onNavigateToSearch) { Icon(Icons.Default.Search, "جستجو", tint = TextSecondary) }
                    IconButton(onClick = onNavigateToProfile) { Icon(Icons.Default.Person, "پروفایل", tint = TextSecondary) }
                }
            }
        },
        containerColor = DarkBackground,
    ) { padding ->
        if (loading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = AccentPurple)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                // Hero section
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth().height(160.dp),
                        colors = CardDefaults.cardColors(containerColor = DarkCard),
                        shape = RoundedCornerShape(16.dp),
                    ) {
                        Box(modifier = Modifier.fillMaxSize().padding(20.dp)) {
                            Column {
                                Text("امروز چه حسی داری؟", style = MaterialTheme.typography.titleLarge, color = TextPrimary)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("بر اساس سلیقه تو روم مناسب رو پیدا کن", style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
                            }
                            Text(
                                "🎵",
                                fontSize = MaterialTheme.typography.displayLarge.fontSize,
                                modifier = Modifier.align(Alignment.BottomEnd),
                            )
                        }
                    }
                }

                // Category chips
                item {
                    Text("دسته‌بندی‌ها", style = MaterialTheme.typography.titleMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(categories.take(8)) { cat ->
                            FilterChip(
                                selected = false,
                                onClick = { },
                                label = { Text(cat.nameFa) },
                                colors = FilterChipDefaults.filterChipColors(
                                    containerColor = DarkCard,
                                    labelColor = TextSecondary,
                                ),
                                border = FilterChipDefaults.filterChipBorder(
                                    borderColor = CardBorder, selectedBorderColor = AccentLight,
                                    enabled = true, selected = false,
                                ),
                            )
                        }
                    }
                }

                // Room cards
                item {
                    Text("روم‌های زنده", style = MaterialTheme.typography.titleMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                }

                items(rooms) { room ->
                    RoomCard(room = room, onClick = { onNavigateToRoom(room.id) })
                }

                if (rooms.isEmpty()) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                            Text("روم زنده‌ای موجود نیست", color = TextMuted)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun RoomCard(room: RoomDto, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkCard),
        shape = RoundedCornerShape(12.dp),
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Cover placeholder
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceLight),
                contentAlignment = Alignment.Center,
            ) {
                Text("🎵", fontSize = 24.sp)
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    room.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = TextPrimary,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.People,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = TextMuted,
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        "${room.listenerCount ?: 0} نفر",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextMuted,
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Icon(
                        Icons.Default.MusicNote,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = AccentLight,
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        "زنده",
                        style = MaterialTheme.typography.bodySmall,
                        color = Success,
                    )
                }
            }

            Icon(
                Icons.Default.PlayCircle,
                contentDescription = "ورود",
                tint = AccentPurple,
                modifier = Modifier.size(40.dp),
            )
        }
    }
}