from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def indexCarnival(request):
    return render(request, 'carnival-page.html')


def landingPage(request):
    return render(request, 'landing-page.html')

def testingPage(request):
    return render(request, 'testing-page.html')
