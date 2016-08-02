from __future__ import print_function

output = ""

initialize = open("src/initialize.js", "r")
output += initialize.read()
initialize.close()

jquery = open("src/jquery.min.js", "r")
output += jquery.read()
jquery.close()

main = open("src/main.js", "r")
output += main.read()
main.close()

bundle = open("HTMLViews.js", "w")
bundle.write(output)
bundle.close()

print("Build Complete.")