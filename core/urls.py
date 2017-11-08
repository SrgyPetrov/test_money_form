from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles import views
from django.views.generic.base import TemplateView


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^users/', include('users.urls')),
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        url(r'^static/(?P<path>.*)$', views.serve),
    ]
