from django import forms
from .models import Event


class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ('title', 'description', 'location', 'date', 'image')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 6}),
            'date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }