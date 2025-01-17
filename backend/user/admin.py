from django.contrib import admin
from .models import * 

class UserAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'img_avatar', 'img_background']
    list_filter = ['user__is_active', 'user__is_staff']
    search_fields = ['user__username', 'user__email', 'full_name']
admin.site.register(UserInfo, UserAdmin)