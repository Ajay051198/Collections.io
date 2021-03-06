from collection.models import *
from django.db.models import ObjectDoesNotExist
from collection.serializers import *
from collection.permissions import IsOwnerOrReadOnly
from collection.api import get_images_for_tag
from ..permissions import TagPermissions
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from random import randint


class AllTagsView(generics.ListAPIView):
    queryset = Tag.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TagSerializer


def get_random_list(limit, max):
    arr = []
    for _ in range(0, limit):
        arr.append(randint(0, max))
    return arr


class RandomTagView(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = TagSerializer

    def get_queryset(self):
        limit = int(self.request.GET.get('limit', '3'))
        random_list = get_random_list(limit, Tag.objects.count())
        all_tags = Tag.objects.all()
        tags = [all_tags[i] for i in random_list]
        return tags


class TagsToCollection(APIView):
    permission_classes = [IsOwnerOrReadOnly, TagPermissions]

    def post(self, request, coll_id):
        tags = request.POST.get('tags', '').lower()
        tags = tags.split(',')

        try:
            collection = Collection.objects.get(id=coll_id)
        except:
            return Response({'error': 'Collection Not Found'},
                            status.HTTP_404_NOT_FOUND)

        for tag in collection.tags.all():
            collection.tags.remove(tag)

        for tag_name in tags:
            try:
                tag = Tag.objects.get(name=tag_name)
            except ObjectDoesNotExist as err:
                print('error', err)
                print(f"Creating new tag {tag_name}")
                tag = Tag(name=tag_name)
                tag.image_urls = get_images_for_tag(tag_name)
                tag.save()
            collection.tags.add(tag)

        return Response({'success': True}, status.HTTP_200_OK)
