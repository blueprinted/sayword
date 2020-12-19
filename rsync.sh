#!/bin/sh

basepath=$(cd `dirname $0`; pwd)
user=`whoami`
baseDir=`basename ${basepath}`
# echo ${baseDir}

# ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem root@129.28.120.42 "rm -rf /search/www/public/${baseDir}/* && exit"

if [[ $1 != "all" && $1 != "front" && $1 != "bend" ]]; then
    echo "please run this shell script like this: sh rsync.sh all or sh rsync.sh front or sh rsync.sh bend"
    exit
fi

if [[ $1 == "all" || $1 == "front" ]]; then
    gulp clean && gulp default && gulp html
    rsync -avzl --timeout=5 --exclude=.svn --exclude=.git --exclude=.gitignore --exclude=.DS_Store --exclude=*.sh -e "ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem" ${basepath}/dist/ root@129.28.120.42:/search/www/public/h5/${baseDir}/
    rsync -avzl --timeout=5 --delete --exclude=.svn --exclude=.git --exclude=.gitignore --exclude=.DS_Store --exclude=*.sh -e "ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem" ${basepath}/dist/ root@129.28.120.42:/search/www/public/h5/${baseDir}/
fi

if [[ $1 == "all" || $1 == "bend" ]]; then
    rsync -avzl --timeout=5 --exclude=.svn --exclude=.git --exclude=.gitignore --exclude=.DS_Store --exclude=*.sh --exclude=bend/data/cookiefile/* --exclude=bend/data/session/* --exclude=bend/log/* -e "ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem" ${basepath}/bend root@129.28.120.42:/search/www/public/h5/${baseDir}/
    ssh -i /Users/${user}/Public/ShellAlias/bootkey.pem root@129.28.120.42 "chmod -R 0777 /search/www/public/h5/${baseDir}/bend/data/audio && chmod -R 0777 /search/www/public/h5/${baseDir}/bend/log && exit"
fi

echo "rsync done"
