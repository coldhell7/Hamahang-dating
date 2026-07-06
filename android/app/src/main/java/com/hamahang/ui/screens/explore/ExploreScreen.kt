package com.hamahang.app.ui.screens.explore

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
import com.hamahang.app.data.api.CategoryDto
import com.hamahang.app.data.api.RoomDto
import com.hamahang.app.ui.theme.*
import com.hamahang.app.ui.screens.home.RoomCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExploreScreen(
    onNavigateToRoom: (String) -> Unit,
) {
    var rooms by remember { mutableStateOf<List<RoomDto>>(emptyList()) }
    var categories by remember { mutableStateOf<List<CategoryDto>>(emptyList()) }
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(selectedCategory) {
        loading = true
        try {
            val roomsRes = ApiClient.api.getRooms(selectedCategory)
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
                title = { Text("کاوش", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground),
            )
        },
        containerColor = DarkBackground,
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            // Category filters
            LazyRow(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                item {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick = { selectedCategory = null },
                        label = { Text("همه") },
                        colors = FilterChipDefaults.filterChipColors(
                            containerColor = DarkCard,
                            selectedContainerColor = AccentPurple,
                            labelColor = TextSecondary,
                            selectedLabelColor = TextPrimary,
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            borderColor = CardBorder, selectedBorderColor = AccentLight,
                            enabled = true, selected = selectedCategory == null,
                        ),
                    )
                }
                items(categories) { cat ->
                    FilterChip(
                        selected = selectedCategory == cat.id,
                        onClick = { selectedCategory = cat.id },
                        label = { Text(cat.nameFa) },
                        colors = FilterChipDefaults.filterChipColors(
                            containerColor = DarkCard,
                            selectedContainerColor = AccentPurple,
                            labelColor = TextSecondary,
                            selectedLabelColor = TextPrimary,
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            borderColor = CardBorder, selectedBorderColor = AccentLight,
                            enabled = true, selected = selectedCategory == cat.id,
                        ),
                    )
                }
            }

            if (loading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = AccentPurple)
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    items(rooms) { room ->
                        RoomCard(room = room, onClick = { onNavigateToRoom(room.id) })
                    }
                    if (rooms.isEmpty()) {
                        item {
                            Box(modifier = Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.SearchOff, contentDescription = null, modifier = Modifier.size(48.dp), tint = TextMuted)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text("رومی با این دسته‌بندی یافت نشد", color = TextMuted)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
