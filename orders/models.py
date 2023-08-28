# from django.contrib.auth import get_user_model
from django.db import models


class Client(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False)
    telephone = models.CharField(max_length=64, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.telephone})"


class Device(models.Model):
    type = models.CharField(max_length=64, blank=False, null=False)
    brand = models.CharField(max_length=64, blank=False, null=False)
    model = models.CharField(max_length=64, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.type} {self.brand} {self.model}"


class User(models.Model):
    class Role(models.IntegerChoices):
        ADMIN = 0
        WORKER = 10
        RECEIVER = 20

    name = models.CharField(max_length=64, blank=False, null=False)
    password = models.CharField(max_length=64, blank=False, null=False)
    color = models.CharField(max_length=8, blank=False, null=False)
    role = models.IntegerField(choices=Role.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True, default=None)

    def __str__(self) -> str:
        return self.name


class Order(models.Model):
    pincode = models.CharField(max_length=8, null=True)
    start_date = models.DateField(auto_now_add=True)
    finish_date = models.DateField(blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.PROTECT)
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    client_name = models.CharField(max_length=64, blank=True, null=True)
    client_telephone = models.CharField(max_length=64, blank=True, null=True)
    serial = models.CharField(max_length=64, blank=True, null=True)
    equipment = models.TextField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    worker = models.ForeignKey(User, on_delete=models.PROTECT, related_name="worker", null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="user")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"Order #{self.pk}"


class Bill(models.Model):
    date = models.DateField(auto_now_add=True)
    summ = models.IntegerField(null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="create")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"Check #{self.pk}"


class Work(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="works")
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    date = models.DateField(auto_now_add=True)
    work = models.TextField(blank=True, null=True)
    work_price = models.IntegerField(null=False, default=0)
    hardware = models.JSONField(blank=True, null=True)
    hardware_price = models.IntegerField(null=False, default=0)
    bill = models.ForeignKey(Bill, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)


class Status(models.Model):
    class Meta:
        verbose_name_plural = "Statuses"

    order = models.ManyToManyField(Order, related_name="status")
    icon = models.CharField(max_length=32, blank=False, null=False)
    title = models.CharField(max_length=32, blank=False, null=False)
    sequence = models.IntegerField(null=True)


# class Order_status(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.PROTECT)
#     status = models.ForeignKey(Status, on_delete=models.PROTECT)
#     user = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
#     created_at = models.DateTimeField(auto_now_add=True)


class Event(models.Model):
    class Charter(models.IntegerChoices):
        ORDER = 1
        WORK = 2
        PRINT = 3
        SMS = 4

    class Action(models.IntegerChoices):
        CREATE = 0
        EDIT = 1
        DELETE = 3
        PRINT = 4
        RECEIVE = 5

    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="event")
    charter = models.IntegerField(choices=Charter.choices)
    action = models.IntegerField(choices=Action.choices)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
