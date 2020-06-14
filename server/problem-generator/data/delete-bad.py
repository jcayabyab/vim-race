from os import walk
import shutil
f = []
for (_, _, filenames) in walk("./infiles"):
    f.extend(filenames)
    break

for filename in f:
    infile_name = "infiles/" + filename
    outfile_name = "outfiles/" + filename
    infile = open(infile_name, "r")
    outfile = open(outfile_name, "r")
    infile_txt = infile.read()
    outfile_txt = outfile.read()
    infile.close()
    outfile.close()

    # print
    print("Input: ")
    print(infile_txt)
    print("=======")
    print("Output: ")
    print(outfile_txt)
    print("=======")

    print("Delete? (y/n)")
    if input().lower() == "y":
        # delete files
        shutil.move(infile_name, "deleted/infiles")
        shutil.move(outfile_name, "deleted/outfiles")