from django.db import models
from backend.imgur_utils import upload_image_to_imgur
from contributors.models import *

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=200)

    def __str__(self):
        return self.name


class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    anothername = models.CharField(max_length=200, null=True)
    img = models.URLField(null=True, blank=True) 
    authors = models.ManyToManyField(Author, through='BookAuthor', related_name='books')
    artist = models.CharField(max_length=100, null=True)
    isCompleted = models.BooleanField(null=True, blank=True)
    workerid = models.IntegerField(default=-1, null=True)
    note = models.TextField(null=True)
    quantityVol = models.IntegerField(default=0)
    dateUpload = models.DateField(null=True)
    dateUpdate = models.DateTimeField(null=True)
    categories = models.ManyToManyField('Category', related_name='books', blank=True)
    isDeleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title or "Unnamed Book"

    def save(self, *args, **kwargs):
        if self.img:
            self.img = upload_image_to_imgur(self.img)  
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