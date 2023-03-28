if [[ $1 = '' ]]; then
    echo 'usage: generate_page.sh <path>'
    exit
fi

ng g m $1
ng g c $1
node scripts/update_page_modules.js $1