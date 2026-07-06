package com.hamahang.app.ui.screens.settings

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
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QuestionAnswer
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hamahang.app.ui.theme.AccentPurple
import com.hamahang.app.ui.theme.CardBorder
import com.hamahang.app.ui.theme.DarkBackground
import com.hamahang.app.ui.theme.DarkCard
import com.hamahang.app.ui.theme.TextMuted
import com.hamahang.app.ui.theme.TextPrimary
import com.hamahang.app.ui.theme.TextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBack: () -> Unit = {},
    onLogout: () -> Unit = {},
    onBlockedUsers: () -> Unit = {},
    onPresetMessages: () -> Unit = {},
) {
    var notificationsEnabled by remember { mutableStateOf(true) }
    var highQualityAudio by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = DarkBackground,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "تنظیمات",
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState()),
        ) {
            // Account section
            SectionHeader(title = "حساب کاربری")

            SettingsItem(
                icon = Icons.Default.Person,
                title = "اطلاعات حساب",
                subtitle = "مشاهده و ویرایش اطلاعات شخصی",
                onClick = { /* Navigate to edit account */ },
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            // Notifications section
            SectionHeader(title = "اعلان‌ها")

            SettingsToggle(
                icon = Icons.Default.Notifications,
                title = "اعلان‌ها",
                subtitle = "دریافت نوتیفیکیشن‌ها",
                checked = notificationsEnabled,
                onCheckedChange = { notificationsEnabled = it },
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            // Audio section
            SectionHeader(title = "صدا")

            SettingsToggle(
                icon = Icons.Default.VolumeUp,
                title = "کیفیت صدای بالا",
                subtitle = "پخش موسیقی با کیفیت بالا (مصرف اینترنت بیشتر)",
                checked = highQualityAudio,
                onCheckedChange = { highQualityAudio = it },
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            // Content section
            SectionHeader(title = "مدیریت")

            SettingsItem(
                icon = Icons.Default.Block,
                title = "کاربران بلاک شده",
                subtitle = "مشاهده و مدیریت کاربران بلاک شده",
                onClick = onBlockedUsers,
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            SettingsItem(
                icon = Icons.Default.QuestionAnswer,
                title = "پیام‌های سریع",
                subtitle = "مدیریت پیام‌های از پیش تعیین شده",
                onClick = onPresetMessages,
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            // About section
            SectionHeader(title = "درباره")

            SettingsItem(
                icon = Icons.Default.Info,
                title = "درباره هم‌آهنگ",
                subtitle = "نسخه ۱.۰.۰",
                onClick = { /* Show about dialog */ },
            )

            SettingsItem(
                icon = Icons.Default.MusicNote,
                title = "توسعه داده شده توسط",
                subtitle = "تیم هم‌آهنگ",
                onClick = {},
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 16.dp),
                color = CardBorder.copy(alpha = 0.3f),
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Logout button
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .clickable(onClick = onLogout),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFE74C3C).copy(alpha = 0.1f),
                ),
                border = CardDefaults.outlinedCardBorder().copy(
                    width = 1.dp,
                    brush = androidx.compose.ui.graphics.SolidColor(
                        Color(0xFFE74C3C).copy(alpha = 0.3f),
                    ),
                ),
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        imageVector = Icons.Default.Logout,
                        contentDescription = null,
                        tint = Color(0xFFE74C3C),
                        modifier = Modifier.size(24.dp),
                    )
                    Spacer(modifier = Modifier.width(14.dp))
                    Text(
                        text = "خروج از حساب",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFFE74C3C),
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun SectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 13.sp,
        fontWeight = FontWeight.Bold,
        color = AccentPurple,
        modifier = Modifier.padding(start = 20.dp, top = 24.dp, bottom = 8.dp),
    )
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(AccentPurple.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = AccentPurple,
                modifier = Modifier.size(22.dp),
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = TextPrimary,
            )
            Text(
                text = subtitle,
                fontSize = 12.sp,
                color = TextMuted,
            )
        }

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = TextMuted,
            modifier = Modifier.size(20.dp),
        )
    }
}

@Composable
private fun SettingsToggle(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(AccentPurple.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = AccentPurple,
                modifier = Modifier.size(22.dp),
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = TextPrimary,
            )
            Text(
                text = subtitle,
                fontSize = 12.sp,
                color = TextMuted,
            )
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = TextPrimary,
                checkedTrackColor = AccentPurple,
                uncheckedThumbColor = TextMuted,
                uncheckedTrackColor = CardBorder,
            ),
        )
    }
}
