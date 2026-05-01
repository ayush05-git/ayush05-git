import http from 'http';
import { PacmanRenderer } from 'pacman-contribution-graph';
import querystring from 'querystring';
import url from 'url';

const PORT = process.env.PORT || 3000;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;

const generateSvg = async (userName, platform, gameTheme) => {
    return new Promise((resolve, reject) => {
        const conf = {
            platform,
            username: userName,
            outputFormat: "svg",
            gameSpeed: 1,
            gameTheme,
            githubSettings: {
                accessToken: githubToken
            },
            svgCallback: (animatedSVG) => resolve(animatedSVG)
        };

        try {
            const pr = new PacmanRenderer(conf);
            pr.start();
        } catch (err) {
            reject(err);
        }
    });
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);

    const username = queryParams.username || 'your-github-username';
    const platform = queryParams.platform || 'github';
    const gameTheme = queryParams.gameTheme || 'github-dark';

    try {
        const svg = await generateSvg(username, platform, gameTheme);

        res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store'
        });

        res.end(svg);
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end('Error generating SVG');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
