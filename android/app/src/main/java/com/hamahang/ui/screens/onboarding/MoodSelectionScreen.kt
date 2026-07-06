package com.hamahang.app.ui.screens.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.data.api.CategoryDto
import com.hamahang.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MoodSelectionScreen(
    onNext: () -> Unit,
    onBack: () -> Unit,
) {
    var moods by remember { mutableStateOf<List<CategoryDto>>(emptyList()) }
    var selectedIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val response = ApiClient.api.getCategories("mood")
            if (response.isSuccessful) {
                moods = response.body() ?: emptyList()
            }
        } catch (_: Exception) { } finally {
            loading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("") },
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Text("بازگشت", color = AccentLight)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        bottomBar = {
            Button(
                onClick = onNext,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentPurple),
                shape = MaterialTheme.shapes.medium,
            ) {
                Text("ادامه")
            }
        },
        containerColor = DarkBackground,
    ) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 16.dp)
        ) {
            Text(
                text = "حال‌وهوای مورد علاقه‌ات چیه؟",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "انتخاب کن تا موسیقی‌های مناسب حال تو رو پیشنهاد بدیم",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
            )
            Spacer(modifier = Modifier.height(24.dp))

            if (loading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = AccentPurple)
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    items(moods) { mood ->
                        val isSelected = selectedIds.contains(mood.id)
                        FilterChip(
                            selected = isSelected,
                            onClick = {
                                selectedIds = if (isSelected) selectedIds - mood.id
                                else selectedIds + mood.id
                            },
                            label = { Text(mood.nameFa) },
                            colors = FilterChipDefaults.filterChipColors(
                                containerColor = DarkCard,
                                selectedContainerColor = AccentPurple,
                                labelColor = TextSecondary,
                                selectedLabelColor = TextPrimary,
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                borderColor = CardBorder, selectedBorderColor = AccentLight,
                                enabled = true, selected = isSelected,
                            ),
                            modifier = Modifier.height(48.dp).fillMaxWidth(),
                        )
                    }
                }
            }
        }
    }
}
