from django.shortcuts import render,redirect
from django.views import View

from .models import Topic
from .forms import TopicForm

class IndexView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.all()
        context = { "topics":topics }

        return render(request,"bbs/index.html",context)

    def post(self, request, *args, **kwargs):

        form    = TopicForm(request.POST)

        if form.is_valid():
            print("OK")
            form.save()

        return redirect("bbs:index")

index   = IndexView.as_view()