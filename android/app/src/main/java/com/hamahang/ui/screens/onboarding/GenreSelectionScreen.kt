package com.hamahang.app.ui.screens.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.data.api.CategoryDto
import com.hamahang.app.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GenreSelectionScreen(
    onNext: () -> Unit,
) {
    var genres by remember { mutableStateOf<List<CategoryDto>>(emptyList()) }
    var selectedIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        try {
            val response = ApiClient.api.getCategories("genre")
            if (response.isSuccessful) {
                genres = response.body() ?: emptyList()
            } else {
                error = "خطا در دریافت دسته‌بندی‌ها"
            }
        } catch (e: Exception) {
            error = "خطا در ارتباط با سرور"
        } finally {
            loading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("") },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        bottomBar = {
            Button(
                onClick = {
                    // Save selected genres to local state
                    onNext()
                },
                enabled = selectedIds.isNotEmpty(),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentPurple),
                shape = MaterialTheme.shapes.medium,
            ) {
                Text("ادامه", fontSize = MaterialTheme.typography.titleMedium.fontSize)
            }
        },
        containerColor = DarkBackground,
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            Text(
                text = "چه سبک‌هایی از موسیقی رو دوست داری؟",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "حداقل یک مورد رو انتخاب کن تا روم‌های مناسب تو رو پیدا کنیم",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
            )
            Spacer(modifier = Modifier.height(24.dp))

            when {
                loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = AccentPurple)
                    }
                }
                error != null -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(error!!, color = Error)
                    }
                }
                else -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        items(genres) { genre ->
                            val isSelected = selectedIds.contains(genre.id)
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    selectedIds = if (isSelected) {
                                        selectedIds - genre.id
                                    } else {
                                        selectedIds + genre.id
                                    }
                                },
                                label = {
                                    Text(
                                        genre.nameFa,
                                        style = MaterialTheme.typography.bodyMedium,
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    containerColor = DarkCard,
                                    selectedContainerColor = AccentPurple,
                                    labelColor = TextSecondary,
                                    selectedLabelColor = TextPrimary,
                                ),
                                border = FilterChipDefaults.filterChipBorder(
                                    borderColor = CardBorder,
                                    selectedBorderColor = AccentLight,
                                    enabled = true,
                                    selected = isSelected,
                                ),
                                modifier = Modifier.height(48.dp).fillMaxWidth(),
                            )
                        }
                    }
                }
            }
        }
    }
}
