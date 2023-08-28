from django.db.models import Q
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render

# from datetime import datetime

from orders.models import (
    Order,
    Work,
    Client,
    Device,
    # User,
    Status
)


def order_view(request: HttpRequest, order_id: int) -> HttpResponse:
    data = Order.objects.filter(id=order_id).all()
    return JsonResponse(list(data.values()), status=200, safe=False)


def work_view(request: HttpRequest, work_id: int) -> HttpResponse:
    data = Work.objects.filter(id=work_id).all()
    return JsonResponse(list(data.values()), status=200, safe=False)


def clients_view(request: HttpRequest) -> HttpResponse:
    data = Client.objects.filter(~Q(id=1)).filter(Q(deleted_at__isnull=True)).all()
    # return JsonResponse(list(data.values()), status=200, safe=False)
    return render(
        request=request,
        template_name="add_list.html",
        context={
            "clients": data,
        }
    )


def devices_view(request: HttpRequest) -> HttpResponse:
    data = Device.objects.filter(Q(deleted_at__isnull=True)).all()
    # return JsonResponse(list(data.values()), status=200, safe=False)
    return render(
        request=request,
        template_name="add_list.html",
        context={
            "devices": data,
        }
    )


def serial_view(request: HttpRequest, device_id: int) -> HttpResponse:
    data = Order.objects.filter(device=device_id).all()
    # return JsonResponse(list(data.values()), status=200, safe=False)
    return render(
        request=request,
        template_name="add_list.html",
        context={
            "serials": data,
        }
    )


def status_edit(request: HttpRequest, order_id: int, status_id: int) -> HttpResponse:
    order = Order.objects.get(id=order_id)
    status = Status.objects.get(id=status_id)

    exists = order.status.filter(id=status_id).exists()  # type: ignore

    if exists:
        order.status.remove(status)  # type: ignore
    else:
        order.status.add(status)  # type: ignore

    return HttpResponse(None, status=200)
