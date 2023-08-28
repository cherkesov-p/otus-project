from django.db.models import Q, Sum, Value
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.db.models.functions import Coalesce
from django.shortcuts import render, get_object_or_404
# from django.contrib.redirects.models import Redirect

from datetime import datetime

from orders.models import (
    Order,
    Work,
    User,
    Status,
    Device,
    Client,
)


def orders_all(request: HttpRequest) -> HttpResponse:
    orders = (
        Order.objects
        .filter(Q(deleted_at__isnull=True))
        .order_by('start_date')
        .select_related('device', 'client', 'user')
        .all()
    )
    # prefetch_related => to many
    return render(
        request=request,
        template_name="orders.html",
        context={
            "title": "Все работы за год",
            "orders": orders,
        }
    )


def orders_incomplete(request: HttpRequest) -> HttpResponse:
    orders = (
        Order.objects
        .filter(Q(finish_date__isnull=True))
        .filter(Q(deleted_at__isnull=True))
        .order_by('start_date')
        .select_related('device', 'client', 'user')
        .prefetch_related('status')
        .all()
    )
    return render(
        request=request,
        template_name="orders.html",
        context={
            "title": "Незавершённые работы",
            "orders": orders,
        }
    )


def orders_complete(request: HttpRequest) -> HttpResponse:
    orders = (
        Order.objects
        .filter(Q(deleted_at__isnull=True))
        .filter(Q(finish_date__isnull=False))
        .order_by('start_date')
        .select_related('device', 'client', 'user')
        .prefetch_related('status')
        .all()
    )
    return render(
        request=request,
        template_name="orders.html",
        context={
            "title": "Завершённые работы",
            "orders": orders,
        }
    )


def order_view(request: HttpRequest, order_id: int) -> HttpResponse:
    order = get_object_or_404(Order, pk=order_id)

    works = (
        Work.objects
        .filter(order_id=order_id)
        .filter(Q(deleted_at__isnull=True))
        .order_by('date')
        .all()
    )

    total_work_price = Work.objects.filter(order_id=order_id).aggregate(
        total_work_price=Coalesce(Sum('work_price'), Value(0))
    )['total_work_price']

    total_hard_price = Work.objects.filter(order_id=order_id).aggregate(
        total_hard_price=Coalesce(Sum('hardware_price'), Value(0))
    )['total_hard_price']

    workers = (
        User.objects
        .order_by('name')
        .filter(Q(role=User.Role.WORKER) | Q(role=User.Role.ADMIN))
        .filter(Q(deleted_at__isnull=True))
        .all()
    )

    statuses = (
        Status.objects
        .order_by('sequence')
        .all()
    )

    return render(
        request=request,
        template_name="order.html",
        context={
            "title": f"Работа #{order.pk}",
            "order": order,
            "works": works,
            "total": {
                "work": total_work_price,
                "hard": total_hard_price,
                "summ": total_work_price + total_hard_price
            },
            "current_date": datetime.now(),
            "workers": workers,
            "statuses": statuses,
            "search": {"options": "worker"},
        }
    )


def order_edit(request: HttpRequest, order_id: int) -> HttpResponse:
    pass


def order_create_form(request: HttpRequest) -> HttpResponse:
    workers = (
        User.objects
        .order_by('name')
        .filter(Q(role=User.Role.WORKER) | Q(role=User.Role.ADMIN))
        .filter(Q(deleted_at__isnull=True))
        .all()
    )

    return render(
        request=request,
        template_name="add.html",
        context={
            "title": "Добавление новой заявки",
            "current_date": datetime.now(),
            "workers": workers,
        }
    )


def order_create(request: HttpRequest) -> HttpResponse:
    element = Order(
        pincode="1111",
        start_date=request.POST['start_date'],
        device=Device.objects.get(id=request.POST['device_id']),
        client=Client.objects.get(id=request.POST['client_id']),
        client_name=request.POST['client_name'],
        client_telephone=request.POST['client_telephone'],
        serial=request.POST['serial'],
        equipment=request.POST['equipment'],
        reason=request.POST['reason'],
        worker=User.objects.get(id=request.POST['worker_id']),
        user=User.objects.get(id=1),
    )
    element.save()
    return order_view(request, element.pk)


def order_complete(request: HttpRequest, order_id: int) -> HttpResponse:
    order = Order.objects.get(id=order_id)
    order.finish_date = datetime.now()
    order.save()

    return order_view(request, order_id)


def order_incomplete(request: HttpRequest, order_id: int) -> HttpResponse:
    order = Order.objects.get(id=order_id)
    order.finish_date = None
    order.save()

    return order_view(request, order_id)


def order_print(request: HttpRequest, order_id: int) -> HttpResponse:
    order = Order.objects.get(id=order_id)
    order.finish_date = datetime.now()
    order.save()

    return order_view(request, order_id)


def work_view(request: HttpRequest, work_id: int) -> HttpResponse:
    data = Work.objects.filter(id=work_id).first()
    return JsonResponse(data, status=200)


def work_create(request: HttpRequest) -> HttpResponse:
    element = Work(
        order=request.POST['order_id'],
        user=request.POST['work_worker'],
        date=request.POST['work_date'],
        work=request.POST['work_text'],
        work_price=request.POST['work_price'],
        hardware=request.POST['work_parts'],
        hardware_price=0
    )
    element.save()
    return order_view(request, int(request.POST['order_id']))


def work_edit(request: HttpRequest, order_id: int) -> HttpResponse:
    pass


def work_delete(request: HttpRequest, order_id: int) -> HttpResponse:
    pass
