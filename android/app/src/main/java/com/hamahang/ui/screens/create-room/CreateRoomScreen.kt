package com.hamahang.app.ui.screens.createroom

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.People
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.data.api.CategoryDto
import com.hamahang.app.data.api.RoomPlanDto
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
fun CreateRoomScreen(
    onBack: () -> Unit = {},
    onRoomCreated: (String) -> Unit = {},
) {
    var title by remember { mutableStateOf("") }
    var categories by remember { mutableStateOf<List<CategoryDto>>(emptyList()) }
    var plans by remember { mutableStateOf<List<RoomPlanDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var isSubmitting by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var selectedCategoryId by remember { mutableStateOf<String?>(null) }
    var selectedPlanId by remember { mutableStateOf<String?>(null) }
    var categoryExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        try {
            val categoriesResponse = ApiClient.api.getCategories(type = "genre")
            if (categoriesResponse.isSuccessful) {
                categories = categoriesResponse.body()?.filter { it.isActive != false }
                    ?: emptyList()
            }
            val plansResponse = ApiClient.api.getRoomPlans()
            if (plansResponse.isSuccessful) {
                plans = plansResponse.body() ?: emptyList()
                if (plans.isNotEmpty()) selectedPlanId = plans.first().id
            }
        } catch (e: Exception) {
            error = "خطا در اتصال به سرور"
        } finally {
            isLoading = false
        }
    }

    val selectedCategoryName = categories.find { it.id == selectedCategoryId }?.nameFa ?: ""
    val selectedPlan = plans.find { it.id == selectedPlanId }
    val isFormValid = title.isNotBlank() && selectedCategoryId != null && selectedPlanId != null

    Scaffold(
        containerColor = DarkBackground,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "ساخت روم جدید",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = TextPrimary,
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "بازگشت",
                            tint = TextPrimary,
                        )
                    }
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
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = "یک روم موسیقی جدید بسازید",
                    fontSize = 16.sp,
                    color = TextMuted,
                    textAlign = TextAlign.Center,
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Title field
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("عنوان روم") },
                    placeholder = { Text("مثال: روم آرامش") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentPurple,
                        unfocusedBorderColor = CardBorder,
                        focusedLabelColor = AccentPurple,
                        unfocusedLabelColor = TextMuted,
                        cursorColor = AccentPurple,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary,
                    ),
                    singleLine = true,
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.MusicNote,
                            contentDescription = null,
                            tint = TextMuted,
                        )
                    },
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Category dropdown
                ExposedDropdownMenuBox(
                    expanded = categoryExpanded,
                    onExpandedChange = { categoryExpanded = it },
                ) {
                    OutlinedTextField(
                        value = selectedCategoryName,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("دسته‌بندی") },
                        placeholder = { Text("انتخاب کنید") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AccentPurple,
                            unfocusedBorderColor = CardBorder,
                            focusedLabelColor = AccentPurple,
                            unfocusedLabelColor = TextMuted,
                            cursorColor = AccentPurple,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                        ),
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded)
                        },
                        singleLine = true,
                    )
                    ExposedDropdownMenu(
                        expanded = categoryExpanded,
                        onDismissRequest = { categoryExpanded = false },
                    ) {
                        categories.forEach { cat ->
                            DropdownMenuItem(
                                text = { Text(cat.nameFa) },
                                onClick = {
                                    selectedCategoryId = cat.id
                                    categoryExpanded = false
                                },
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Plans section
                Text(
                    text = "انتخاب پلن",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    modifier = Modifier.fillMaxWidth(),
                )

                Spacer(modifier = Modifier.height(12.dp))

                plans.forEach { plan ->
                    val isSelected = selectedPlanId == plan.id
                    OutlinedCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { selectedPlanId = plan.id },
                        shape = RoundedCornerShape(12.dp),
                        border = if (isSelected) {
                            CardDefaults.outlinedCardBorder().copy(
                                width = 2.dp,
                                brush = androidx.compose.ui.graphics.SolidColor(AccentPurple),
                            )
                        } else {
                            CardDefaults.outlinedCardBorder().copy(
                                width = 1.dp,
                                brush = androidx.compose.ui.graphics.SolidColor(CardBorder),
                            )
                        },
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = { selectedPlanId = plan.id },
                                colors = RadioButtonDefaults.colors(
                                    selectedColor = AccentPurple,
                                ),
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = plan.name,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = TextPrimary,
                                )
                                Text(
                                    text = "ظرفیت: ${plan.maxCapacity} نفر",
                                    fontSize = 12.sp,
                                    color = TextMuted,
                                )
                            }
                            Text(
                                text = "${plan.price} تومان",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = AccentPurple,
                            )
                        }
                    }
                }

                if (error != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = error ?: "",
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Create button
                Button(
                    onClick = {
                        isSubmitting = true
                        error = null
                        CoroutineScope(Dispatchers.IO).launch {
                            try {
                                val body = mutableMapOf<String, Any>(
                                    "title" to title,
                                    "categoryId" to (selectedCategoryId ?: ""),
                                    "planId" to (selectedPlanId ?: ""),
                                )
                                val response = ApiClient.api.createRoom(body)
                                if (response.isSuccessful) {
                                    response.body()?.let { room ->
                                        onRoomCreated(room.id)
                                    }
                                } else {
                                    error = "خطا در ساخت روم"
                                }
                            } catch (e: Exception) {
                                error = "خطا در اتصال به سرور"
                            } finally {
                                isSubmitting = false
                            }
                        }
                    },
                    enabled = isFormValid && !isSubmitting,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = AccentPurple,
                        disabledContainerColor = AccentPurple.copy(alpha = 0.3f),
                    ),
                ) {
                    if (isSubmitting) {
                        CircularProgressIndicator(
                            color = Color.White,
                            modifier = Modifier.size(24.dp),
                            strokeWidth = 2.dp,
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(20.dp),
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "ساخت روم",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
