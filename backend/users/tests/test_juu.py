import unittest

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        print("testing user tests----")
        self.assertEqual('foo'.upper(), 'FOO')
