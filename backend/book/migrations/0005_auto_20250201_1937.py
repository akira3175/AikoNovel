# Generated by Django 3.1.12 on 2025-02-01 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0003_auto_20250201_1922'),
        ('book', '0004_bookteam'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='workerid',
        ),
        migrations.AddField(
            model_name='book',
            name='teams',
            field=models.ManyToManyField(blank=True, related_name='books', through='book.BookTeam', to='contributors.Team'),
        ),
    ]
