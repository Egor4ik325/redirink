from rest_framework import pagination


class LinkPagination(pagination.PageNumberPagination):
    """
    Response data pagination for link.
    """

    page_size = 20
    max_page_size = 20
    page_query_param = "page"
    page_size_query_param = "page_size"
