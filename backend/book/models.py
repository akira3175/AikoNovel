from django.db import models
from backend.imgur_utils import upload_image_to_imgur
from django.utils.timezone import now
from contributors.models import *

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.name

class BookStatus(models.Model):
    name = models.CharField(max_length=50, unique=True)  
    code = models.CharField(max_length=20, unique=True)  
    description = models.TextField(null=True, blank=True) 

    def __str__(self):
        return self.name

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    another_name = models.CharField(max_length=200, null=True)
    img = models.URLField(null=True, blank=True, default='https://i.imgur.com/OJbZSFy.jpeg') 
    authors = models.ManyToManyField(Author, through='BookAuthor', related_name='books')
    artist = models.CharField(max_length=100, null=True)
    status = models.ForeignKey(
        'BookStatus',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,  
        related_name='books'
    )
    workerid = models.IntegerField(default=-1, null=True)
    note = models.TextField(null=True)
    quantity_volome = models.IntegerField(default=0)
    date_upload = models.DateField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category, related_name='books', blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title or "Unnamed Book"

    def save(self, *args, **kwargs):

        if not self.status:
            self.status = BookStatus.objects.filter(code='ongoing').first()
        super().save(*args, **kwargs)


class BookAuthor(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    is_main_author = models.BooleanField(default=False) 

    class Meta:
        unique_together = ('book', 'author')

    def __str__(self):
        role = "Main Author" if self.is_main_author else "Co-Author"
        return f"{self.author.pen_name} ({role})"