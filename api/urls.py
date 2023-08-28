from django.urls import path

from .views import (
    order_view,

    work_view,

    clients_view,
    devices_view,
    serial_view,
    
    status_edit,
)

urlpatterns = [
    path('order/<int:order_id>', order_view, name='api_order_view'),

    path('work/<int:work_id>', work_view, name='api_work_view'),

    path('clients', clients_view, name='api_clients_view'),
    path('devices', devices_view, name='api_devices_view'),

    path('serial/<int:device_id>', serial_view, name='api_serial_view'),

    path('status/<int:order_id>/<int:status_id>', status_edit, name='api_status_edit'),
]
