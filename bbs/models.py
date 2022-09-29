from django.db import models

class Topic(models.Model):

    comment     = models.CharField(verbose_name="コメント",max_length=2000)
    lat         = models.DecimalField(verbose_name="緯度",max_digits=9, decimal_places=6)
    lon         = models.DecimalField(verbose_name="経度",max_digits=9, decimal_places=6)

    def __str__(self):
        return self.comment