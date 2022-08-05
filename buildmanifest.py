# import OS module
import os

#get folders and files in path
current_path = os.getcwd()
folders = [ f.name for f in os.scandir(current_path) if f.is_dir() ]

#open json
jsonstr = "{"

#loop one level deep into each folder in the base path
for current_folder in folders:
    #start array
    jsonstr += current_folder + ":["
    #get list of files
    files_in_current_folder = [ f.name for f in os.scandir(current_path + "/" + current_folder) if f.is_file() ]
    #populate array
    for current_file in files_in_current_folder:
        if current_file == files_in_current_folder[-1]:
            jsonstr += "\"" + current_file + "\""
        else:
            jsonstr += "\"" + current_file + "\"" + ","
    #close array
    if current_folder == folders[-1]:
        jsonstr += "]"
    else:
        jsonstr += "],"

#close json
jsonstr += "}"

#open output file for manifest in utf-8
output_file = open("manifest.js","w", encoding="utf-8")

#write manifest to js var file_manifest
output_file.write("var file_manifest = " + jsonstr + ";")

#close file
output_file.close()