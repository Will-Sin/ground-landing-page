from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def landingPage(request):
    return render(request, 'landing-page.html')
