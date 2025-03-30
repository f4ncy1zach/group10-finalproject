// Footer component, showing project information
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContent">
                <div className="footerInfo">
                    <p className="footerTitle">A student project by:</p>
                    <p className="footerAuthors">
                        <strong>Austin Philip</strong> · <strong>Han Chen</strong> · <strong>Jinyan Jiang</strong> ·{" "}
                        <strong>Rain Zhang</strong>
                    </p>
                    <p className="footerSchool">
                        <em>Simon Fraser University - Spring 2025</em>
                    </p>

                    <p className="footerCopyright">
                        © 2025 <strong>Travel Advisor Project</strong> — <em>For educational use only.</em>
                    </p>
                    <p className="footerDisclaimer">
                        Data provided by <strong>TripAdvisor API</strong>.
                        <br />
                        <em>This site is a student project and not affiliated with any official travel service.</em>
                    </p>
                </div>
            </div>
        </footer>
    )
}