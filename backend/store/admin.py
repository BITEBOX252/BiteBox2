from django.contrib import admin
from .models import Dish,Category,Gallery,PortionSize,SpiceLevel,Specification,Cart,CartOrder,Tax,CartOrderItem,Notification,Review,DishFAQ,Coupon,Wishlist

class GalleryAdmin(admin.TabularInline):
    model=Gallery
    
class PortionSizeAdmin(admin.TabularInline):
    model=PortionSize

    
class SpiceLevelAdmin(admin.TabularInline):
    model=SpiceLevel

    
class SpecificationAdmin(admin.TabularInline):
    model=Specification

class DishAdmin(admin.ModelAdmin):
    list_display=['title','price','in_stock','featured','featured','category','restaurant']
    list_editable=['featured']
    list_filter=['in_stock','featured']
    search_fields=['title']
    inlines=[GalleryAdmin,PortionSizeAdmin,SpiceLevelAdmin,SpecificationAdmin]



admin.site.register(Dish,DishAdmin)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartOrder)
admin.site.register(CartOrderItem)
admin.site.register(Notification)
admin.site.register(Review)
admin.site.register(Wishlist)
admin.site.register(Coupon)
admin.site.register(DishFAQ)
admin.site.register(Tax)

