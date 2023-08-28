from django.contrib import admin
from .models import (
    Order,
    Client,
    Device,
    User,
    Work,
    Status,
    Event,
    Bill,
)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = "id", "start_date", "device_id", "client_id"
    readonly_fields = ("created_at", "updated_at", "deleted_at")


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = "id", "name", "telephone"


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = "id", "type", "brand", "model"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = "id", "name", "color", "role"


@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    list_display = "order", "work_price", "hardware_price", "user"


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = "id", "date", "summ", "user"


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = "order", "charter", "action", "created_at"


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = "icon", "title", "sequence"
