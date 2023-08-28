from django.urls import path

from .views import (
    orders_all,
    orders_complete,
    orders_incomplete,

    order_view,
    order_create,
    order_create_form,
    order_edit,
    order_complete,
    order_incomplete,
    order_print,

    work_view,
    work_create,
    work_edit,
    work_delete,
)

urlpatterns = [
    path("all", orders_all, name="all"),
    path("complete", orders_complete, name="complete"),
    path("incomplete", orders_incomplete, name="incomplete"),

    path('add', order_create, name='order_create'),
    path('create', order_create_form, name='order_create_from'),
    path('<int:order_id>', order_view, name='order_view'),
    path('<int:order_id>/edit', order_edit, name='order_edit'),
    path('<int:order_id>/complete', order_complete, name='order_complete'),
    path('<int:order_id>/incomplete', order_incomplete, name='order_incomplete'),
    path('<int:order_id>/print', order_print, name='order_print'),

    path('work/create', work_create, name='work_create'),
    path('work/<int:work_id>', work_view, name='work_view'),
    path('work/<int:work_id>/edit', work_edit, name='work_edit'),
    path('work/<int:work_id>/delete', work_delete, name='work_delete'),

    path("", orders_all),

]
