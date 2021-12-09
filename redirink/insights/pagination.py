from rest_framework import pagination


class InsightPagination(pagination.PageNumberPagination):
    """
    Response data pagination for insight.
    """

    page_size = 30
    max_page_size = 30
    page_query_param = "page"
    page_size_query_param = "page_size"
