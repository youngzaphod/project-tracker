import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function FAQs(props) {


    return (
      <Container fluid >
        <Row className='justify-content-center'>
            <Col lg={5}>
                <h3 align="center">Fequently Asked Questions</h3>
                <br/>
                <br/>
                <h4>How do I share my story?</h4>
                <p>
                    Anyone with a link can contribute, so sharing the story is about getting the link to the right people, or to as many
                    people as possible, depending on if you want particular people to contribute or not. After you start or contribute to a story, you'll see the link and social share buttons which make it easier to post
                    or send to a friend. You can also use the share buttons that are at the top of the page, or copy and share the link 
                    from the browser when you're viewing the story.
                </p>
                <p>
                  Remember that you can actually share ANY story - it doesn't have to be yours, or even one you added to. If you come across a
                  story you find interesting, feel free to add to it, share it on social media, or send directly to a friend.
                </p>
                <h4>How do I get others to contribute to my story?</h4>
                <p>
                    It's all about sharing. You can share directly with one person or a small group of friends and ask them to contribute,
                    or two share very broadly on an active social network. Make sure you tell whoever you share with to pass it along as well.
                </p>
                <p>
                  Regardless of how you choose to share it initially, you can also shepard your story along by resharing the link or sending to
                  more people throughout its journey to completion, even if you weren't the last person to contribute.
                </p>
                <h4>Do I need permission to add to someone else's story?</h4>
                <p>
                    Nope! Anyone with the story link can add to an open story, so consider having the link implied permission.
                    If you see the link posted on social media or if someone sent it to you, you can contribute.
                </p>
                <h4>How do I find a story I started or contributed to?</h4>
                <p>
                  Every time you start or contribute to a story, you'll receive an email that includes a link to that story AND a link
                  to all the stories you've started or contributed to. You can always use those links to access a particular story or a 
                  list of all your stories.
                </p>
                <h4>How do I when a story I started or contributed to is complete?</h4>
                <p>
                  Every time you someone adds to a story you started, you'll get a notification, so you can see it progressing and shepard
                  it along if needed.
                </p>
                <p>
                  Everyone that contrubutes to a story will also get an email when it's completed, so they can read the full work in all its glory.
                </p>
                <h4>Will people know what I wrote?</h4>
                <p>
                  The text all appears anonymously on the site, so while people may be able to guess from writing style or other info they have
                  about you, the site will not indicate who wrote what.
                </p>
                <h4>Why is almost all the text blurred on some stories?</h4>
                <p>
                  This is the "fold" feature where Fold and Pass gets its name, harkening back to the era of paper and pens when students would
                  write a few lines on paper, fold it back so that only the last line is visible, and pass to the next person.
                </p>
                <p>
                  When the starting author selects the fold feature on the site, everything except the last 40 characters is blurred, which makes for
                  a very interesting read at the end.
                </p>
                <h4>Can I change a story's settings once it's started?</h4>
                <p>
                  Nope, all of a story's settings - the number of rounds, whether it's public or not, whether it's folded or not - are all
                   decided by the first author and stay consistent throughout the process.
                </p>
                <h3 align="center">Still got a question? Good thing we got this contact page:</h3>
                <br/>
                <div align="center">
                <Link to="/contact/">
                    <Button variant="primary">
                        Ask away
                    </Button>
                </Link>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            </Col>
        </Row>
      </Container>
    );
}

export default FAQs;
