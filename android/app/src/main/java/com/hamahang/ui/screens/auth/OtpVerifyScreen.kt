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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hamahang.app.data.api.ApiClient
import com.hamahang.app.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OtpVerifyScreen(
    phone: String,
    onVerified: () -> Unit,
    onBack: () -> Unit,
) {
    var code by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var resendTimer by remember { mutableIntStateOf(90) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(resendTimer) {
        if (resendTimer > 0) {
            delay(1000)
            resendTimer--
        }
    }

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
                text = "کد تایید",
                style = MaterialTheme.typography.headlineMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "کد ۵ رقمی ارسال شده به $phone را وارد کنید",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                textAlign = TextAlign.Center,
            )
            Spacer(modifier = Modifier.height(32.dp))

            OutlinedTextField(
                value = code,
                onValueChange = { if (it.length <= 5 && it.all { c -> c.isDigit() }) code = it },
                label = { Text("کد تایید") },
                placeholder = { Text("۱۲۳۴۵") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                textStyle = MaterialTheme.typography.headlineLarge.copy(
                    textAlign = TextAlign.Center,
                    letterSpacing = 8.sp,
                ),
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
                    loading = true
                    error = null
                    scope.launch {
                        try {
                            val response = ApiClient.api.verifyOtp(
                                mapOf("phone" to phone, "code" to code)
                            )
                            if (response.isSuccessful) {
                                // Store tokens
                                val authData = response.body()
                                if (authData != null) {
                                    // Save tokens to DataStore
                                    onVerified()
                                }
                            } else {
                                error = "کد وارد شده نادرست است"
                            }
                        } catch (e: Exception) {
                            error = "خطا در ارتباط با سرور"
                        } finally {
                            loading = false
                        }
                    }
                },
                enabled = code.length == 5 && !loading,
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
                    Text("تایید کد", style = MaterialTheme.typography.titleMedium)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (resendTimer > 0) {
                Text(
                    text = "ارسال مجدد تا ${resendTimer} ثانیه دیگر",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextMuted,
                )
            } else {
                TextButton(onClick = {
                    resendTimer = 90
                    scope.launch {
                        try {
                            ApiClient.api.sendOtp(mapOf("phone" to phone))
                        } catch (_: Exception) { }
                    }
                }) {
                    Text("ارسال مجدد کد", color = AccentLight)
                }
            }
        }
    }
}
