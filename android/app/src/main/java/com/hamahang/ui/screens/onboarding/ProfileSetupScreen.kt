package com.hamahang.app.ui.screens.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.hamahang.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileSetupScreen(
    onComplete: () -> Unit,
    onBack: () -> Unit,
) {
    var name by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var birthYear by remember { mutableStateOf("") }
    var genderExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("") },
                navigationIcon = {
                    TextButton(onClick = onBack) { Text("بازگشت", color = AccentLight) }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        bottomBar = {
            Button(
                onClick = onComplete,
                enabled = name.isNotBlank() && gender.isNotBlank(),
                modifier = Modifier.fillMaxWidth().padding(16.dp).height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentPurple),
                shape = MaterialTheme.shapes.medium,
            ) { Text("تکمیل اطلاعات") }
        },
        containerColor = DarkBackground,
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = "پروفایلت رو تکمیل کن",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "این اطلاعات به بقیه نشون داده می‌شه",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
            )
            Spacer(modifier = Modifier.height(32.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("نام و نام خانوادگی") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentPurple,
                    cursorColor = AccentLight,
                    focusedLabelColor = AccentLight,
                    unfocusedTextColor = TextPrimary,
                    focusedTextColor = TextPrimary,
                ),
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(16.dp))

            ExposedDropdownMenuBox(
                expanded = genderExpanded,
                onExpandedChange = { genderExpanded = it }
            ) {
                OutlinedTextField(
                    value = when (gender) {
                        "male" -> "مرد"
                        "female" -> "زن"
                        else -> ""
                    },
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("جنسیت") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = genderExpanded) },
                    modifier = Modifier.fillMaxWidth().menuAnchor(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentPurple,
                        cursorColor = AccentLight,
                        focusedLabelColor = AccentLight,
                        unfocusedTextColor = TextPrimary,
                        focusedTextColor = TextPrimary,
                    ),
                )
                ExposedDropdownMenu(
                    expanded = genderExpanded,
                    onDismissRequest = { genderExpanded = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("مرد") },
                        onClick = { gender = "male"; genderExpanded = false }
                    )
                    DropdownMenuItem(
                        text = { Text("زن") },
                        onClick = { gender = "female"; genderExpanded = false }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("شهر") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentPurple,
                    cursorColor = AccentLight,
                    focusedLabelColor = AccentLight,
                    unfocusedTextColor = TextPrimary,
                    focusedTextColor = TextPrimary,
                ),
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = birthYear,
                onValueChange = { if (it.length <= 4) birthYear = it },
                label = { Text("سال تولد") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentPurple,
                    cursorColor = AccentLight,
                    focusedLabelColor = AccentLight,
                    unfocusedTextColor = TextPrimary,
                    focusedTextColor = TextPrimary,
                ),
                singleLine = true,
            )
        }
    }
}
