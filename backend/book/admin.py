from django.contrib import admin
from .models import *
from contributors.models import Author

class BookAuthorInline(admin.TabularInline):
    model = BookAuthor
    extra = 1 
    
class BookTeamInline(admin.TabularInline):
    model = BookTeam
    extra = 1

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'status', 'date_upload', 'date_update')  
    search_fields = ('title', 'another_name', 'authors__pen_name') 
    list_filter = ('status', 'categories') 
    inlines = [BookAuthorInline, BookTeamInline] 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)  

@admin.register(BookAuthor)
class BookAuthorAdmin(admin.ModelAdmin):
    list_display = ('book', 'author', 'is_main_author')  
    list_filter = ('is_main_author',) 

@admin.register(BookTeam)
class BookTeamAdmin(admin.ModelAdmin):
    list_display = ('team', 'book', 'is_main_team') 
    list_filter = ('is_main_team',) 

@admin.register(BookStatus)
class BookStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'description')

@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'book')