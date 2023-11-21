# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    # theres two parts to this solution, 
    # reverse a list of size 0-1, reverse a list of size 2+
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # base case, if length of list is 1
        if not head:
            return None

        # if length is list is 2
        if head.next == None:
            return head
        
        returned_head = self.reverseList(head.next)

        # ------------------------------------------ 
        # second last node, as we just returned from the last node with
        # condition 2
        head.next.next = head
        head.next = None
        # 2 or more nodes, return value
        return returned_head

        # iterative
        # you should be able to return as it is if there are no
        # additional returned calls