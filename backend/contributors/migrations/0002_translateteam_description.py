# Generated by Django 3.1.12 on 2025-01-23 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='translateteam',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
