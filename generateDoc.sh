#!/bin/bash
# Script to generate documentations for the server api-rest and the algorithm of detection of depression disorders

# This is the absolute path to the binary
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# To exit on error
set -e

# Function to check if the server api-rest docs directory exists else create it
check_if_the_server_api-rest_dirctory_exists_else_create_it()
{
	if [ ! -d "docs/server_api-rest" ]; then
		mkdir docs/server_api-rest
	fi
}

# Function to check if the algorithm of detection of potential depression disorders docs dirctory exists else create it
check_if_the_algorithm_of_detection_of_potential_depression_disorders_directory_exists_else_create_it()
{
	if [ ! -d "docs/potential_disorders_detection" ]; then
		mkdir docs/potential_disorders_detection
	fi
}

# Function to check if the matching algorithm docs dirctory exists else create it
check_if_the_matching_algorithm_directory_exists_else_create_it()
{
	if [ ! -d "docs/matching_algorithm" ]; then
		mkdir docs/matching_algorithm
	fi
}

# Function to generate documentations for the algorithm of detection of potential depression disorders
generate_doc_algorithm_of_detection_of_potential_depression_disorders()
{
	cd $DIR/server/src/algorithms/potential_disorders_detection/
	if [ ! -d "node_modules" ]; then
		echo "Installing dependencies for algorithm of detection of potential depression disorders. Please wait..."
		npm ci
	fi
	./node_modules/jsdoc/jsdoc.js -c ./jsdoc.conf.json
	echo "Documentation has been generated for algorithm of detection of potential depression disorders !"
}

# Function to generate documentations for the matching algorithm
generate_doc_of_matching_algorithm()
{
	cd $DIR/server/src/algorithms/matching/
	if [ ! -d "node_modules" ]; then
		echo "Installing dependencies for matching algorithm. Please wait..."
		npm ci
	fi
	./node_modules/jsdoc/jsdoc.js -c ./jsdoc.conf.json
	echo "Documentation has been generated for matching algorithm !"
}


# Function to generate documentations for the server
generate_doc_server_api-rest()
{
	cd $DIR/server/
	if [ ! -d "node_modules" ]; then
		echo "Installing dependencies for server api-rest. Please wait..."
		npm ci
	fi
	./node_modules/jsdoc/jsdoc.js -c ./jsdoc.conf.json
	echo "Documentation has been generated for server api-rest !"
}

# Function check if banner.png exists in server api-rest documentation folders else copy it
check_if_serv_doc_bannerPNG_exists_else_copy_it()
{
	cd $DIR/

	if [ ! -f "docs/server_api-rest/banner.png" ]; then
		cp banner.png docs/server_api-rest/banner.png
	fi
}

# Function check if banner.png exists in documentation potential depression disorders folders else copy it
check_if_algorithm_of_detection_of_potential_depression_disorders_doc_bannerPNG_exists_else_copy_it()
{
	cd $DIR/

	if [ ! -f "docs/potential_disorders_detection/banner.png" ]; then
		cp banner.png docs/potential_disorders_detection/banner.png
	fi
}

# Function check if banner.png exists in documentation matching algorithm folders else copy it
check_if_matching_algorithm_doc_bannerPNG_exists_else_copy_it()
{
	cd $DIR/

	if [ ! -f "docs/potential_disorders_detection/banner.png" ]; then
		cp banner.png docs/potential_disorders_detection/banner.png
	fi
	if [ ! -f "docs/matching_algorithm/banner.png" ]; then
		cp banner.png docs/matching_algorithm/banner.png
	fi
	if [ ! -f "docs/server_api-rest/banner.png" ]; then
		cp banner.png docs/server_api-rest/banner.png
	fi
}


# Function to describe the usage
usage()
{
	echo "This script is to generate docs for the server api-rest, the algorithm of detection of potential depression disorders and the matching algorithm.

Usages:

Method 1, to generate all docs:
	- $0

Method 2, to generate only doc for the algorithm of detection of potential depression disorders:
	- $0 disorders
	- $0 ADPDD
	- $0 adpdd

Method 3, to generate only doc for the algorithm of detection of potential depression disorders:
	- $0 matching
	- $0 matching_algorithm
	- $0 MA
	- $0 ma

Method 4, to generate only doc for the server:
	- $0 server
	- $0 serv
	- $0 api"
}

if [ "$#" -ne 1 ]; then
	check_if_the_server_api-rest_dirctory_exists_else_create_it
	check_if_the_algorithm_of_detection_of_potential_depression_disorders_directory_exists_else_create_it
	check_if_the_matching_algorithm_directory_exists_else_create_it

	generate_doc_server_api-rest
	generate_doc_algorithm_of_detection_of_potential_depression_disorders
	generate_doc_of_matching_algorithm

	check_if_serv_doc_bannerPNG_exists_else_copy_it
	check_if_algorithm_of_detection_of_potential_depression_disorders_doc_bannerPNG_exists_else_copy_it
	check_if_matching_algorithm_doc_bannerPNG_exists_else_copy_it

elif  [[ ( "$#" -eq 1 ) && ( "$1" == "disorders" || "$1" == "ADPDD" || "$1" == "adpdd" ) ]]; then
	check_if_the_algorithm_of_detection_of_potential_depression_disorders_directory_exists_else_create_it
	generate_doc_algorithm_of_detection_of_potential_depression_disorders
	check_if_algorithm_of_detection_of_potential_depression_disorders_doc_bannerPNG_exists_else_copy_it

elif  [[ ( "$#" -eq 1 ) && ( "$1" == "matching" || "$1" == "matching_algorithm" || "$1" == "MA" || "$1" == "ma" ) ]]; then
	check_if_the_matching_algorithm_directory_exists_else_create_it
	generate_doc_of_matching_algorithm
	check_if_matching_algorithm_doc_bannerPNG_exists_else_copy_it

elif [[ ( "$#" -eq 1 ) && ( "$1" == "server" || "$1" == "serv" || "$1" == "api" ) ]]; then
	check_if_the_server_api-rest_dirctory_exists_else_create_it
	generate_doc_server_api-rest
	check_if_serv_doc_bannerPNG_exists_else_copy_it

elif  [[ ( "$#" -eq 1 ) && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
	usage
	exit 0
else
	echo "If you don't know how to use it look at the help ($0 -h or $0 --help)." >&2
	exit 1
fi

exit 0
