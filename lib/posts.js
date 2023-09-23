import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
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

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }

  export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  

    const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
    // Combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
  }