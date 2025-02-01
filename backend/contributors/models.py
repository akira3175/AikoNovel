from django.db import models
from django.contrib.auth.models import User

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name="author_profile")
    pen_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.pen_name

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)  
    description = models.TextField(null=True, blank=True)  

    def __str__(self):
        return self.name


class TeamType(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)
    
    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=255, unique=True) 
    description = models.TextField(null=True, blank=True)
    members = models.ManyToManyField(
        User,
        through='TeamMember',
        related_name='teams'
    )
    type = models.ForeignKey(
        TeamType, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='teams'
    )

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    team = models.ForeignKey(Team, on_delete=models.CASCADE)  
    role = models.ForeignKey(Role, on_delete=models.CASCADE) 

    class Meta:
        unique_together = ('user', 'team')

    def __str__(self):
        return f"{self.user.username} - {self.role.name} in {self.team.name}"
