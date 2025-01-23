from django.contrib import admin
from .models import Book, BookAuthor, Category
from contributors.models import Author

class BookAuthorInline(admin.TabularInline):
    model = BookAuthor
    extra = 1 

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'status', 'date_upload', 'date_update')  
    search_fields = ('title', 'another_name', 'authors__pen_name') 
    list_filter = ('status', 'categories') 
    inlines = [BookAuthorInline] 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)  

@admin.register(BookAuthor)
class BookAuthorAdmin(admin.ModelAdmin):
    list_display = ('book', 'author', 'is_main_author')  
    list_filter = ('is_main_author',) 
