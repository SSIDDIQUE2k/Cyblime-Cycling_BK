from django import forms
from .models import Photo


class PhotoForm(forms.ModelForm):
    class Meta:
        model = Photo
        fields = ('title', 'image', 'description')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }