import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory=path.join(process.cwd(),'posts');

export function getSortedPostsData(){
    const fileNames=fs.readdirSync(postsDirectory);//filenames is array of all file names in postsDirectory
    const allPostsData=fileNames.map((fileName)=>{
        const id=fileName.replace(/\.md$/,'');//the first arguament of this function is regular expression and which shows strings which ends with .md and . is special character in regex so we have to use \ before it

        const fullPath=path.join(postsDirectory,fileName);
        const fileContents=fs.readFileSync(fullPath,'utf8');//returns the contents of the path

        const matterResult=matter(fileContents);//this parses the post metadata section!
        //this function returns object whith properties: 1.data(in this case it is an object with date and title),2.content, 3.excerpt
            return {
                id,
                ...matterResult.data,
            };
    });

    return allPostsData.sort((a,b)=>{
        if(a.date<b.date)
        return 1;
    else return -1;
    });
}