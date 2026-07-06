package com.hamahang.app.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onVerify: (String) -> Unit,
) {
    var phone by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Scaffold(
        containerColor = DarkBackground,
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = "🎵",
                fontSize = MaterialTheme.typography.displayLarge.fontSize,
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "به هم‌آهنگ خوش آمدی",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "برای شروع، شماره موبایلت رو وارد کن",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
            )
            Spacer(modifier = Modifier.height(32.dp))

            OutlinedTextField(
                value = phone,
                onValueChange = { if (it.length <= 11 && it.all { c -> c.isDigit() }) phone = it },
                label = { Text("شماره موبایل") },
                placeholder = { Text("۰۹۱۲۳۴۵۶۷۸۹") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AccentPurple,
                    cursorColor = AccentLight,
                    focusedLabelColor = AccentLight,
                    unfocusedTextColor = TextPrimary,
                    focusedTextColor = TextPrimary,
                    unfocusedBorderColor = CardBorder,
                ),
            )

            if (error != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(error!!, color = Error, style = MaterialTheme.typography.bodySmall)
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    if (phone.length != 11 || !phone.startsWith("09")) {
                        error = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"
                        return@Button
                    }
                    error = null
                    loading = true
                    scope.launch {
                        try {
                            val response = ApiClient.api.sendOtp(mapOf("phone" to phone))
                            if (response.isSuccessful) {
                                onVerify(phone)
                            } else {
                                error = "خطا در ارسال کد"
                            }
                        } catch (e: Exception) {
                            error = "خطا در ارتباط با سرور"
                        } finally {
                            loading = false
                        }
                    }
                },
                enabled = phone.length == 11 && !loading,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentPurple),
                shape = MaterialTheme.shapes.medium,
            ) {
                if (loading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = TextPrimary,
                        strokeWidth = 2.dp,
                    )
                } else {
                    Text("ارسال کد تایید", style = MaterialTheme.typography.titleMedium)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "کد تایید برای شماره شما پیامک می‌شود",
                style = MaterialTheme.typography.bodySmall,
                color = TextMuted,
            )
        }
    }
}
